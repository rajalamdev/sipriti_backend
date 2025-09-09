const { v4 } = require('uuid');
const asyncHandler = require('../middleware/asyncHandler');
const { HakiProposal, MemberProposal, User } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Create proposal (ketua).
 */
exports.createProposal = asyncHandler(async (req, res) => {
  const { judul, bidang_fokus, tahun_pelaksanaan } = req.body;
  const file_url = req.file ? `/uploads/proposals/${req.file.filename}` : null;

  const proposal = await HakiProposal.create({
    id: v4(),
    judul,
    bidang_fokus,
    tahun_pelaksanaan,
    file_url,
    status_usulan: 'Pending',
    status_dana: 'Tidak Didanai'
  });

  await MemberProposal.create({
    id: v4(),
    haki_proposal_id: proposal.id,
    user_id: req.user.id,
    peran: 'Ketua',
    status_invite: 'Accepted'
  });

  return res.status(201).json({ message: 'Proposal berhasil dibuat', data: proposal });
});

/**
 * Ketua invite anggota.
 * Hanya Ketua (yang sudah terdaftar di table MemberProposal sebagai Ketua & Accepted)
 * boleh mengundang.
 */
exports.inviteMember = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { user_id } = req.body;

  // cek proposal ada
  const proposal = await HakiProposal.findByPk(proposalId);
  if (!proposal) return res.status(404).json({ message: 'Proposal tidak ditemukan' });

  // cek apakah requester adalah ketua proposal (peran ketua dan sudah accepted)
  const isKetua = await MemberProposal.findOne({
    where: {
      haki_proposal_id: proposalId,
      user_id: req.user.id,
      peran: 'Ketua',
      status_invite: 'Accepted'
    }
  });
  if (!isKetua && req.user.role?.name !== 'admin') {
    return res.status(403).json({ message: 'Hanya Ketua (atau admin) yang dapat mengundang anggota' });
  }

  // cek user yang diundang ada
  const user = await User.findByPk(user_id);
  if (!user) return res.status(404).json({ message: 'User yang diundang tidak ditemukan' });

  // hindari duplikat undangan
  const existing = await MemberProposal.findOne({
    where: { haki_proposal_id: proposalId, user_id }
  });
  if (existing) {
    return res.status(400).json({ message: 'User sudah diundang atau sudah menjadi anggota' });
  }

  const invite = await MemberProposal.create({
    id: v4(),
    haki_proposal_id: proposalId,
    user_id,
    peran: 'Anggota',
    status_invite: 'Pending'
  });

  return res.status(201).json({ message: 'Undangan berhasil dikirim', data: invite });
});

/**
 * User respond invite.
 * Endpoint ini **menggunakan req.user.id** sehingga user hanya bisa merespon undangan miliknya.
 * Body: { action: 'accept' | 'decline' } atau { status_invite: 'Accepted' | 'Declined' }
 */
exports.respondInvite = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { action, status_invite } = req.body;
  const userId = req.user.id;

  // Temukan undangan berdasarkan proposalId + user login
  const invite = await MemberProposal.findOne({
    where: {
      haki_proposal_id: proposalId,
      user_id: userId
    }
  });


  if (!invite) return res.status(404).json({ message: 'Undangan tidak ditemukan untuk user ini' });

  if (invite.status_invite !== 'Pending') {
    return res.status(400).json({ message: 'Undangan sudah dibalas' });
  }

  // Normalisasi input
  let newStatus;
  if (status_invite) {
    if (!['Accepted', 'Declined'].includes(status_invite)) {
      return res.status(400).json({ message: 'status_invite tidak valid' });
    }
    newStatus = status_invite;
  } else if (action) {
    if (action === 'accept') newStatus = 'Accepted';
    else if (action === 'decline') newStatus = 'Declined';
    else return res.status(400).json({ message: 'action tidak valid' });
  } else {
    return res.status(400).json({ message: 'action atau status_invite harus disertakan' });
  }

  invite.status_invite = newStatus;
  await invite.save();

  return res.status(200).json({ message: `Undangan ${newStatus}`, data: invite });
});

/**
 * GET /invites/my - lihat undangan user login
 */
exports.getMyInvites = asyncHandler(async (req, res) => {
  const invites = await MemberProposal.findAll({
    where: { user_id: req.user.id },
    include: [
      { model: HakiProposal, as: 'proposal', attributes: ['id','judul','file_url','status_usulan','status_dana'] }
    ],
    order: [['createdAt','DESC']]
  });

  return res.status(200).json({ data: invites });
});

/**
 * Admin review proposal:
 * Body: { status_usulan: 'Approved'|'Declined', status_dana: 'Didanai'|'Tidak Didanai' }
 * (Anda dapat mengirim salah satu atau keduanya)
 */
exports.adminReviewProposal = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { status_usulan, status_dana } = req.body;

  const allowedUsulan = ['Pending','Approved','Declined'];
  const allowedDana = ['Didanai','Tidak Didanai'];

  const proposal = await HakiProposal.findByPk(proposalId);
  if (!proposal) return res.status(404).json({ message: 'Proposal tidak ditemukan' });

  if (status_usulan) {
    if (!allowedUsulan.includes(status_usulan)) return res.status(400).json({ message: 'status_usulan tidak valid' });
    proposal.status_usulan = status_usulan;
  }
  if (status_dana) {
    if (!allowedDana.includes(status_dana)) return res.status(400).json({ message: 'status_dana tidak valid' });
    proposal.status_dana = status_dana;
  }

  await proposal.save();
  return res.status(200).json({ message: 'Proposal berhasil direview', data: proposal });
});
