import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // parse form data (works for application/x-www-form-urlencoded and multipart)
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    if (!String(data.company || "").trim() || !String(data.phone || "").trim()) {
      return NextResponse.json(
        { success: false, error: "Company and phone are required." },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const messageText = `Name: ${data.firstName || ""} ${data.lastName || ""}
Email: ${data.email || ""}
Company: ${data.company || ""}
Phone: ${data.phone || ""}
Role: ${data.role || ""}
Interest: ${data.interest || ""}

Message:
${data.message || ""}`;

    const mailOptions = {
      from: `${process.env.SMTP_USER}`,
      to: process.env.CONTACT_RECIPIENT || "crashaw@gmail.com",
      subject: `New contact message from ${data.firstName || data.email || "website"}`,
      text: messageText,
      html: `<p><strong>Name:</strong> ${data.firstName || ""} ${data.lastName || ""}</p>
             <p><strong>Email:</strong> ${data.email || ""}</p>
             <p><strong>Company:</strong> ${data.company || ""}</p>
             <p><strong>Phone:</strong> ${data.phone || ""}</p>
             <p><strong>Role:</strong> ${data.role || ""}</p>
             <p><strong>Interest:</strong> ${data.interest || ""}</p>
             <p><strong>Message:</strong></p>
             <p>${(data.message || "").replace(/\n/g, "<br/>")}</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error sending contact email:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
