# Email Service Setup

## Overview
The Nurtura backend includes an email service that automatically sends welcome emails to new users with their login credentials.

## Configuration

### Environment Variables
Create a `.env` file in the backend directory with the following variables:

```bash
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a password for "Mail"
3. Use the generated password as `SMTP_PASS`

### Other SMTP Providers
You can use any SMTP provider. Common alternatives:
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's SMTP settings

## Features

### Automatic Password Generation
- New users receive secure, randomly generated passwords
- Passwords include uppercase, lowercase, numbers, and symbols
- Users are prompted to change password on first login

### Email Templates
- **center-welcome**: Sent to center admins after registration
- **user-welcome**: Sent to new users with login credentials
- **welcome**: General welcome email for new accounts

### Fallback System
- If email service is not configured, users are still created
- System logs warnings but continues operation
- Admin can see generated passwords in the response

## Testing

Run the email test script:
```bash
cd backend
node test-email.js
```

This will:
1. Check if email credentials are configured
2. Test SMTP connection
3. Send a test email if configured

## Troubleshooting

### Common Issues
1. **Authentication failed**: Check SMTP credentials and app passwords
2. **Connection timeout**: Verify SMTP host and port
3. **TLS errors**: Some providers require specific TLS settings

### Debug Mode
Enable detailed logging by setting:
```bash
NODE_ENV=development
```

### Email Not Sending
- Check console logs for error messages
- Verify environment variables are loaded
- Test SMTP connection manually
- Check firewall/network restrictions

## Security Notes
- Never commit `.env` files to version control
- Use app passwords, not your main password
- Consider using environment-specific configurations
- Monitor email sending for abuse prevention

