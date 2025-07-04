import { Request, Response } from "express";
import { Contact } from "../models/Contact";
import validator from "validator";
import nodemailer from "nodemailer";
import { User } from "../models/User";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmailNotification = async () => {
  const adminUser = await User.findOne({ where: { role: "admin" } });
  if (!adminUser) {
    console.error("Admin user not found for email notification.");
    return;
  }

  const mailOptions = {
    from: `"Contact Form" <${process.env.SMTP_USER}>`,
    to: adminUser.email,
    subject: "Nuevo formulario de contacto recibido",
    html: `<!DOCTYPE html>
            <html lang="en" >
            <head>
              <meta charset="UTF-8">
              <title>CodePen - OTP Email Template</title>
            </head>
            <body>
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Burger Express</a>
                </div>
                <p style="font-size:1.1em">Hola,</p>
                <p>Estimado administrador, has recibido un nuevo formulario de contacto, por favor asegurate de revisarlo a la brevedad</p>
                <p style="font-size:0.9em;">Saludos,<br />Burger Express</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                </div>
              </div>
            </div>
            <!-- partial -->
              
            </body>
            </html>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email notification sent successfully.");
  } catch (error) {
    console.error("Error sending email notification:", error);
  }
};

export const createContact = async (
  req: Request,
  res: Response
): Promise<any> => {
  let { full_name, email, phone_number, message, status } = req.body;

  if (!full_name || !email || !message) {
    return res
      .status(400)
      .json({ error: "One or more required fields are missing." });
  }

  if (!status) {
    status = 1;
  } else {
    status = status;
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json({ error: "Invalid email format.", code: "INVALID_EMAIL" });
  }

  full_name = validator.escape(full_name || "");
  email = validator.normalizeEmail(email || "") || "";
  phone_number = phone_number ? validator.escape(phone_number) : "";
  message = validator.escape(message || "");

  try {
    const contact = await Contact.create({
      full_name,
      email,
      phone_number,
      message,
      status,
    });
    await sendEmailNotification();
    res.status(201).json(contact);
  } catch (err) {
    console.error("Create Contact Error:", err);
    res.status(500).json({ error: "Failed to create contact." });
  }
};

export const getAllContacts = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Get All Contacts Error:", err);
    res.status(500).json({ error: "Failed to retrieve contacts." });
  }
};

export const getContactById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found." });
    }
    res.status(200).json(contact);
  } catch (err) {
    console.error("Get Contact By ID Error:", err);
    res.status(500).json({ error: "Failed to retrieve contact." });
  }
};

export const updateContactStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "resolved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    const [updatedCount, [updatedContact]] = await Contact.update(
      { status },
      { where: { id }, returning: true }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ error: "Contact not found." });
    }

    res.status(200).json(updatedContact);
  } catch (err) {
    console.error("Update Contact Status Error:", err);
    res.status(500).json({ error: "Failed to update contact status." });
  }
};

export const deleteContact = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const deletedCount = await Contact.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Contact not found." });
    }
    res.status(200).json({ message: "Contact deleted successfully." });
  } catch (err) {
    console.error("Delete Contact Error:", err);
    res.status(500).json({ error: "Failed to delete contact." });
  }
};
