import { Router } from "express";
import {
  mostrarVistaClientes,
  mostrarFormularioCrear,
  crearCliente,
  mostrarFormularioEditar,
  actualizarCliente,
  eliminarCliente
} from "../controllers/clientes.controller.js";

const router = Router();

// Listado
router.get("/", mostrarVistaClientes);

// Formulario crear
router.get("/crear", mostrarFormularioCrear);
router.post("/crear", crearCliente);

// Formulario editar
router.get("/editar/:id", mostrarFormularioEditar);
router.post("/editar/:id", actualizarCliente);

// Eliminar (GET para simplificar)
router.get("/eliminar/:id", eliminarCliente);

export default router;
