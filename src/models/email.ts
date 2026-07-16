export interface EmailRecipient {
  name: string;
  email: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/** Payload for transactional emails that link the user to an action URL. */
export interface UserActionEmailPayload {
  user: EmailRecipient;
  url: string;
}

export interface OrganizationInviteEmailPayload {
  invitation: { id: string };
  inviter: { name: string };
  organization: { name: string };
  email: string;
}
