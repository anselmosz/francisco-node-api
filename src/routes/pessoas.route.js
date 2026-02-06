import { Router } from "express";
import { PessoasController } from "../controllers/pessoas.controller.js";

const router = Router();

// router.get("/", PessoasController.listar);
router.get("/:id", PessoasController.buscarPorID);
router.get("/", PessoasController.buscar);
router.post("/", PessoasController.criar);
router.put("/:id", PessoasController.atualizar);
router.patch("/:id/desativar", PessoasController.desativar);
router.patch("/:id/ativar", PessoasController.ativar);

export default router;