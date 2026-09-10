import express from 'express';
import bcrypt from 'bcryptjs';
import { Prioridade, StatusTarefa } from '@prisma/client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from './lib/prisma.ts';

const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = process.env.PORT || 3000;
const enumValue = (value, type) => type[String(value).toUpperCase().replaceAll('-', '_').replaceAll(' ', '_')];
const outputTask = task => ({ ...task, userId: task.usuarioId, priority: task.prioridade.toLowerCase(), status: task.status.toLowerCase().replace('_', ' '), user: task.usuario });
const publicUser = ({ id, nome, email }) => ({ id, nome, email });

app.use(express.json());
app.use(express.static(path.join(root, 'frontend')));
app.post('/api/login', async (req, res) => { const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || ''); if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' }); const user = await prisma.usuario.findUnique({ where: { email } }); if (!user || !(await bcrypt.compare(password, user.senhaHash))) return res.status(401).json({ error: 'Senha incorreta ou e-mail não cadastrado.' }); return res.json(publicUser(user)); });
app.get('/api/users', async (_req, res) => res.json((await prisma.usuario.findMany({ orderBy: { nome: 'asc' } })).map(publicUser)));
app.post('/api/users', async (req, res) => { const { name, email, password } = req.body; if (!name || !email || !password || password.length < 6) return res.status(400).json({ error: 'Nome, e-mail e senha de pelo menos 6 caracteres são obrigatórios.' }); try { const user = await prisma.usuario.create({ data: { nome: name.trim(), email: email.trim().toLowerCase(), senhaHash: await bcrypt.hash(password, 12) } }); return res.status(201).json(publicUser(user)); } catch (error) { return res.status(error.code === 'P2002' ? 409 : 400).json({ error: 'Este e-mail já está cadastrado.' }); } });
app.get('/api/tasks', async (_req, res) => { const tasks = await prisma.tarefa.findMany({ include: { usuario: true }, orderBy: { dataCadastro: 'desc' } }); res.json(tasks.map(outputTask)); });
app.post('/api/tasks', async (req, res) => { const { description, sector, userId, priority, status = 'a fazer' } = req.body; if (!description || !sector || !userId || !priority) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' }); try { const task = await prisma.tarefa.create({ data: { descricao: description.trim(), setor: sector.trim(), usuarioId: Number(userId), prioridade: enumValue(priority, Prioridade), status: enumValue(status, StatusTarefa) }, include: { usuario: true } }); return res.status(201).json(outputTask(task)); } catch { return res.status(400).json({ error: 'Não foi possível criar a tarefa.' }); } });
app.put('/api/tasks/:id', async (req, res) => { const { description, sector, userId, priority, status } = req.body; try { const task = await prisma.tarefa.update({ where: { id: Number(req.params.id) }, data: { descricao: description.trim(), setor: sector.trim(), usuarioId: Number(userId), prioridade: enumValue(priority, Prioridade), status: enumValue(status, StatusTarefa) }, include: { usuario: true } }); return res.json(outputTask(task)); } catch { return res.status(400).json({ error: 'Não foi possível atualizar a tarefa.' }); } });
app.delete('/api/tasks/:id', async (req, res) => { try { await prisma.tarefa.delete({ where: { id: Number(req.params.id) } }); return res.status(204).end(); } catch { return res.status(404).json({ error: 'Tarefa não encontrada.' }); } });
app.use((_req, res) => res.sendFile(path.join(root, 'frontend', 'index.html')));
app.listen(port, () => console.log(`Fluxo disponível em http://localhost:${port}`));
