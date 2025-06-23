const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema(
  {
    id: String,
    description: String,
    attachmentType: { type: String, required: true },
    mimeType: { type: String, required: true },
    name: String,
    url: String,
    "@type": { type: String, default: "AttachmentRef", required: true },
  },
  { _id: false }
);

const ChannelSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    "@type": { type: String, default: "ChannelRef", required: true },
  },
  { _id: false }
);

const NoteSchema = new mongoose.Schema(
  {
    id: String,
    author: String,
    date: String,
    text: String,
    "@type": { type: String, default: "Note", required: true },
  },
  { _id: false }
);

const RelatedEntitySchema = new mongoose.Schema(
  {
    role: String,
    "@type": { type: String, default: "RelatedEntity", required: true },
    entity: {
      id: String,
      href: String,
      name: String,
      "@type": { type: String, default: "EntityRef" },
      "@referredType": String,
    },
  },
  { _id: false }
);

const RelatedPartySchema = new mongoose.Schema(
  {
    role: String,
    "@type": {
      type: String,
      default: "RelatedPartyRefOrPartyRoleRef",
      required: true,
    },
    partyOrPartyRole: {
      id: String,
      href: String,
      name: String,
      "@type": {
        type: String,
        required: true,
        default: "PartyOrPartyRoleRef",
      },
      "@referredType": String,
    },
  },
  { _id: false }
);

const TroubleTicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creationDate: { type: String, default: () => new Date().toISOString() },
  expectedResolutionDate: { type: String },
  requestedResolutionDate: { type: String },
  resolutionDate: { type: String },
  priority: { type: String, enum: ["Low", "Medium", "High"] },
  severity: {
    type: String,
    enum: ["Critical", "Major", "Minor"],
    required: true,
  },
  status: {
    type: String,
    enum: [
      "acknowledged",
      "rejected",
      "pending",
      "held",
      "inProgress",
      "cancelled",
      "closed",
      "resolved",
    ],
    default: "acknowledged",
    required: true,
  },
  ticketType: { type: String, required: true },
  attachment: [AttachmentSchema],
  channel: ChannelSchema,
  note: [NoteSchema],
  relatedEntity: [RelatedEntitySchema],
  relatedParty: [RelatedPartySchema],
  "@type": { type: String, default: "TroubleTicket", required: true },
});

module.exports = mongoose.model("TroubleTicket", TroubleTicketSchema);
