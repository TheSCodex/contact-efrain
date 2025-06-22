import { Request, Response } from "express";
import { Contact } from "../models/Contact";

export const createContact = async (req: Request, res: Response): Promise<any>  => {
  const { full_name, email, phone_number, message } = req.body;

  if (!full_name || !email || !message) {
    return res.status(400).json({ error: "full_name, email, and message are required." });
  }

  try {
    const contact = await Contact.create({ full_name, email, phone_number, message });
    res.status(201).json(contact);
  } catch (err) {
    console.error("Create Contact Error:", err);
    res.status(500).json({ error: "Failed to create contact." });
  }
};

export const getAllContacts = async (_req: Request, res: Response): Promise<any> => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Get All Contacts Error:", err);
    res.status(500).json({ error: "Failed to retrieve contacts." });
  }
};

export const getContactById = async (req: Request, res: Response): Promise<any> => {
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

export const deleteContact = async (req: Request, res: Response): Promise<any> => {
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