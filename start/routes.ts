/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const GroupsController = () => import('#controllers/groups_controller')
const MetasController = () => import('#controllers/metas_controller')

// Rotas de autenticação (públicas)
router.post('/api/auth/register', [AuthController, 'register'])
router.post('/api/auth/login', [AuthController, 'login'])

// Rotas protegidas por autenticação

// Auth
router.get('/api/auth/me', [AuthController, 'me']).use(middleware.auth())
router.post('/api/auth/logout', [AuthController, 'logout']).use(middleware.auth())

// Grupos
router.get('/api/groups', [GroupsController, 'index']).use(middleware.auth())
router.post('/api/groups', [GroupsController, 'store']).use(middleware.auth())
router.post('/api/groups/join', [GroupsController, 'join']).use(middleware.auth())
router.get('/api/groups/:id', [GroupsController, 'show']).use(middleware.auth())

// Metas
router.get('/api/metas', [MetasController, 'index']).use(middleware.auth())
router.post('/api/metas', [MetasController, 'store']).use(middleware.auth())
router.get('/api/metas/:id', [MetasController, 'show']).use(middleware.auth())
router.put('/api/metas/:id', [MetasController, 'update']).use(middleware.auth())
router.delete('/api/metas/:id', [MetasController, 'destroy']).use(middleware.auth())

// Metas Pequenas
router
  .post('/api/metas/:id/metas-pequenas', [MetasController, 'addMetaPequena'])
  .use(middleware.auth())
router
  .put('/api/metas/:id/metas-pequenas/:metaPequenaId', [MetasController, 'updateMetaPequena'])
  .use(middleware.auth())
router
  .delete('/api/metas/:id/metas-pequenas/:metaPequenaId', [
    MetasController,
    'deleteMetaPequena',
  ])
  .use(middleware.auth())


// Rota de teste
router.get('/', async () => {
  return {
    hello: 'world',
    message: 'API Metas Backend está funcionando!',
  }
})
