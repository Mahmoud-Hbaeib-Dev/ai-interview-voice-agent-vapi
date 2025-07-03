import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('SENDGRID_API_KEY is not set in environment variables');
}
sgMail.setApiKey(apiKey);

export async function POST(request) {
  try {
    // Log that we're starting the email send process
    console.log('Starting email send process...');

    // Parse the request body
    const body = await request.json();
    console.log('Received request body:', body);

    const { 
      to, 
      subject, 
      position, 
      duration, 
      questions, 
      expirationDate, 
      interviewLink,
      companyName = 'Jobite',
      companyEmail = process.env.SENDGRID_FROM_EMAIL,
      companyLogo 
    } = body;

    // Validate required fields
    if (!to || !subject || !position || !duration || !interviewLink) {
      console.error('Missing required fields:', { to, subject, position, duration, interviewLink });
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Missing required fields' 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate environment variables
    if (!process.env.SENDGRID_FROM_EMAIL) {
      console.error('SENDGRID_FROM_EMAIL is not set in environment variables');
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Server configuration error' 
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a more professional subject line
    const emailSubject = `Interview Invitation: ${position} Position at ${companyName || 'Jobite'}`;

    // Create email content with better formatting
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          ${companyLogo ? `<img src="${companyLogo}" alt="${companyName} Logo" style="max-height: 80px; margin-bottom: 20px;">` : ''}
          <h2 style="color: #2563eb; margin-bottom: 10px;">${companyName || 'Jobite'}</h2>
          <p style="color: #6b7280; margin: 0;">${companyEmail || process.env.SENDGRID_FROM_EMAIL}</p>
        </div>

        <h2 style="color: #2563eb; margin-bottom: 20px;">Interview Invitation</h2>
        
        <p>Dear Candidate,</p>
        
        <p>Thank you for your interest in the <strong>${position}</strong> position at <strong>${companyName || 'Jobite'}</strong>. We are pleased to invite you to participate in our AI-powered interview process.</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Interview Details</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin: 10px 0;">⏱️ <strong>Duration:</strong> ${duration} minutes</li>
            <li style="margin: 10px 0;">❓ <strong>Number of Questions:</strong> ${questions}</li>
            <li style="margin: 10px 0;">📅 <strong>Available Until:</strong> ${expirationDate}</li>
            <li style="margin: 10px 0;">🏢 <strong>Company:</strong> ${companyName || 'Jobite'}</li>
          </ul>
        </div>

        <div style="margin: 20px 0;">
          <p><strong>Instructions:</strong></p>
          <ol style="color: #4b5563;">
            <li>Click the "Start Interview" button below when you're ready</li>
            <li>Ensure you have a stable internet connection</li>
            <li>Find a quiet place where you won't be disturbed</li>
            <li>Test your microphone before starting</li>
          </ol>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${interviewLink}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Start Interview
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Best regards,<br/>
          Recruitment Team<br/>
          ${companyName || 'Jobite'}<br/>
          ${companyEmail || process.env.SENDGRID_FROM_EMAIL}
        </p>
      </div>
    `;

    // Create plain text version
    const textContent = `
Dear Candidate,

Thank you for your interest in the ${position} position at ${companyName || 'Jobite'}. We are pleased to invite you to participate in our AI-powered interview process.

Interview Details:
- Duration: ${duration} minutes
- Number of Questions: ${questions}
- Available Until: ${expirationDate}
- Company: ${companyName || 'Jobite'}

Instructions:
1. Use the link below when you're ready to start
2. Ensure you have a stable internet connection
3. Find a quiet place where you won't be disturbed
4. Test your microphone before starting

Interview Link:
${interviewLink}

Best regards,
Recruitment Team
${companyName || 'Jobite'}
${companyEmail || process.env.SENDGRID_FROM_EMAIL}
    `.trim();

    // Prepare email message
    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: companyName || 'Jobite Recruitment'
      },
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
      mail_settings: {
        sandbox_mode: {
          enable: false
        }
      },
      replyTo: companyEmail || process.env.SENDGRID_FROM_EMAIL
    };

    console.log('Attempting to send email with config:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject
    });

    // Send the email
    await sgMail.send(msg);
    console.log('Email sent successfully');

    // Return success response
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    // Log the detailed error
    console.error('Detailed error in send-email route:', {
      error: error.toString(),
      response: error.response?.body,
      code: error.code,
      stack: error.stack
    });

    // Return error response
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: error.response?.body?.errors?.[0]?.message || error.message || 'Failed to send email',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 