import { Router } from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
} from "../controllers/contact";

const router = Router();

router.post("/contact", createContact);
router.get("/contact", getAllContacts);
router.get("/contact/:id", getContactById);
router.delete("/contact/:id", deleteContact);

export default router;