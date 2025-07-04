import { Router } from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
} from "../controllers/contact";
import { apiKeyAuth } from "../middleware/apiKeyAuth";

const contactRouter = Router();

contactRouter.use(apiKeyAuth);

contactRouter.post("/contact", createContact);
contactRouter.get("/contact", getAllContacts);
contactRouter.get("/contact/:id", getContactById);
contactRouter.delete("/contact/:id", deleteContact);
contactRouter.put("/contact/:id/status", deleteContact);

export default contactRouter;