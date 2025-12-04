# Módulo de Gestión de Cuentas de Usuario - Documentación

## Resumen de Implementación

Se ha implementado exitosamente un módulo administrativo completo para la gestión y moderación de cuentas de usuario en la plataforma ManosAmigas.

## Cambios Realizados

### 1. Actualización de Tipos (src/types/User.ts)

**Cambios:**
- Actualizado el tipo `estado_cuenta` para usar valores de caracteres: `'U' | 'V' | 'S' | string`
  - `'U'`: Pendiente de verificación
  - `'V'`: Verificado/Activo
  - `'S'`: Suspendido
- Agregada la interfaz `UpdateAccountStatusDTO` para las actualizaciones de estado

```typescript
export interface UpdateAccountStatusDTO {
  accountStatus: 'V' | 'S';
}
```

### 2. Nuevo Servicio de Administración (src/services/adminService.ts)

**Funciones implementadas:**

#### `fetchUsers(accountStatus?: 'U' | 'V' | 'S' | null)`
- Obtiene la lista de usuarios filtrada opcionalmente por estado de cuenta
- Endpoint: `GET /api/Personas/GetPersons?accountStatus={accountStatus}`
- Retorna: `FetchUsersResult` con array de usuarios o error

#### `updateAccountStatus(personId: string, newStatus: 'V' | 'S')`
- Actualiza el estado de cuenta de un usuario específico
- Endpoint: `PATCH /api/Personas/{personId}`
- Body: `{ "accountStatus": newStatus }`
- Retorna: `UpdateStatusResult` con éxito o error

### 3. Nuevo Componente AdminUserAccounts (src/pages/AdminUserAccounts.tsx)

**Características principales:**

#### Interfaz de Usuario
- Header consistente con el resto de la aplicación
- Menú de usuario con avatar y rol
- Botón "Volver al inicio" para navegación

#### Filtros de Estado
- Botones de filtro para cada estado:
  - **Todos**: Muestra todos los usuarios
  - **Pendientes (U)**: Solo usuarios pendientes de verificación
  - **Verificados (V)**: Solo usuarios activos/verificados
  - **Suspendidos (S)**: Solo usuarios suspendidos
- Contador de usuarios por cada filtro
- Indicador visual del filtro activo

#### Tabla de Usuarios
Columnas incluidas:
- **Usuario**: Avatar, nombre completo e identificación
- **Email**: Correo electrónico
- **Teléfono**: Número de contacto
- **Rol**: Badge con el rol (Administrador/Solicitante/Prestador)
- **Estado**: Badge con ícono indicador del estado
- **Acciones**: Botones de moderación (solo para pendientes)

#### Acciones de Moderación
Para usuarios en estado `'U'` (Pendiente):
- **Botón Aprobar**: Cambia el estado a `'V'` (Verificado)
  - Color verde con ícono de check
  - Confirmación automática con notificación
- **Botón Suspender**: Cambia el estado a `'S'` (Suspendido)
  - Color rojo con ícono X
  - Requiere confirmación del usuario

#### Paginación
- 10 usuarios por página
- Navegación con botones anterior/siguiente
- Botones numerados para acceso directo a páginas

#### Notificaciones
- Sistema de notificaciones toast
- Tipos: éxito (verde) y error (rojo)
- Desaparición automática después de 4 segundos

#### Estadísticas
Tarjetas con métricas clave:
- Total de usuarios
- Usuarios pendientes
- Usuarios verificados

#### Funcionalidad de Recarga
- Botón "Actualizar" para recargar la lista
- Icono de refresh animado

### 4. Actualización de App.tsx

**Cambios en navegación:**

#### Tipo ViewType actualizado
```typescript
type ViewType = 'home' | 'login' | 'register' | 'pending' |
                'solicitanteDashboard' | 'prestadorDashboard' |
                'serviceResults' | 'adminDashboard';
```

#### Lógica de Login actualizada
```typescript
const handleLogin = async (email: string, password: string) => {
  // ...
  if (result.user.estado_cuenta === 'U') {
    setCurrentView('pending');
  } else if (result.user.rol === '0' && result.user.estado_cuenta === 'V') {
    // Nuevo: Redirige a adminDashboard si es administrador verificado
    setCurrentView('adminDashboard');
  } else {
    setCurrentView('home');
  }
  // ...
};
```

#### Función handleGoToDashboard actualizada
```typescript
const handleGoToDashboard = () => {
  if (user) {
    if (user.rol === '0') {
      setCurrentView('adminDashboard');  // Nuevo
    } else if (user.rol === '1') {
      setCurrentView('solicitanteDashboard');
    } else if (user.rol === '2') {
      setCurrentView('prestadorDashboard');
    }
  }
};
```

#### Renderizado condicional
```typescript
{currentView === 'adminDashboard' && user && (
  <AdminUserAccounts
    user={user}
    onBackToHome={handleBackToHome}
    onLogout={handleLogout}
    onGoToLogin={handleGoToLogin}
    onGoToDashboard={handleGoToDashboard}
    onGoToServiceSearch={handleGoToServiceSearch}
  />
)}
```

### 5. Actualización de Roles en Componentes

**Función getRoleName estandarizada en todos los componentes:**

```typescript
const getRoleName = () => {
  if (!user) return '';
  switch (user.rol) {
    case '0':
      return 'Administrador';
    case '1':
      return 'Solicitante';
    case '2':
      return 'Prestador';
    default:
      return 'Usuario';
  }
};
```

**Archivos actualizados:**
- src/pages/Homepage.tsx
- src/pages/PrestadorDashboard.tsx
- src/pages/ServiceResults.tsx
- src/pages/SolicitanteDashboard.tsx
- src/pages/AdminUserAccounts.tsx

## Esquema de Roles

| Código | Rol | Descripción |
|--------|-----|-------------|
| '0' | Administrador | Acceso al panel de gestión de usuarios |
| '1' | Solicitante | Usuario que solicita servicios |
| '2' | Prestador | Usuario que ofrece servicios |

## Esquema de Estados de Cuenta

| Código | Estado | Descripción | Acciones Disponibles |
|--------|--------|-------------|----------------------|
| 'U' | Pendiente | Cuenta en proceso de verificación | Aprobar, Suspender |
| 'V' | Verificado | Cuenta activa y verificada | Ninguna (desde admin) |
| 'S' | Suspendido | Cuenta suspendida | Ninguna (desde admin) |

## Endpoints del Backend Utilizados

### 1. Obtener Lista de Usuarios
```
GET /api/Personas/GetPersons?accountStatus={accountStatus}
```
**Parámetros:**
- `accountStatus` (opcional): 'U', 'V', 'S', o null para todos

**Respuesta esperada:**
```typescript
User[]
```

### 2. Actualizar Estado de Cuenta
```
PATCH /api/Personas/{personId}
```
**Body:**
```json
{
  "accountStatus": "V" | "S"
}
```

**Respuesta esperada:**
- Status 200: Éxito
- Status 4xx/5xx: Error con mensaje descriptivo

## Flujo de Usuario Administrador

1. **Login**
   - El administrador inicia sesión con credenciales
   - Si `rol === '0'` y `estado_cuenta === 'V'`, se redirige a `adminDashboard`

2. **Panel de Administración**
   - Ve la lista completa de usuarios
   - Puede filtrar por estado de cuenta
   - Visualiza estadísticas generales

3. **Moderación de Cuentas Pendientes**
   - Identifica usuarios con estado 'U'
   - Puede aprobar (cambio a 'V') o suspender (cambio a 'S')
   - Recibe confirmación visual de cada acción

4. **Actualización**
   - Puede refrescar la lista en cualquier momento
   - Los cambios se reflejan inmediatamente

## Características de Diseño

- **Colores consistentes**: Uso de la paleta de colores de ManosAmigas (#7ECBF2, etc.)
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Iconografía**: Uso de lucide-react para iconos consistentes
- **Estados visuales**: Hover effects, transiciones suaves
- **Accesibilidad**: Labels adecuados, contraste suficiente
- **Feedback visual**: Notificaciones, estados de carga, confirmaciones

## Seguridad

- Todas las operaciones requieren autenticación
- Solo usuarios con rol '0' pueden acceder al panel de administración
- Confirmación requerida para acciones destructivas (suspender)
- Uso de HTTPS para todas las comunicaciones (configurado en backend)

## Testing Recomendado

1. **Flujo de Login Administrador**
   - Verificar redirección correcta para rol '0'
   - Verificar que no redirige si estado es 'U'

2. **Filtros**
   - Probar cada filtro de estado
   - Verificar contadores correctos

3. **Paginación**
   - Crear más de 10 usuarios de prueba
   - Navegar entre páginas

4. **Acciones de Moderación**
   - Aprobar un usuario pendiente
   - Suspender un usuario pendiente
   - Verificar notificaciones

5. **Manejo de Errores**
   - Simular error de red
   - Verificar mensajes de error apropiados

## Compilación

El proyecto compila exitosamente sin errores ni warnings:

```bash
npm run build
✓ built in 5.79s
```

## Próximas Mejoras Sugeridas

1. **Búsqueda por texto**: Filtrar usuarios por nombre o email
2. **Orden personalizado**: Ordenar por columna
3. **Exportación**: Descargar lista de usuarios en CSV/Excel
4. **Historial de acciones**: Log de cambios de estado
5. **Información detallada**: Modal con detalles completos del usuario
6. **Acciones bulk**: Aprobar/suspender múltiples usuarios a la vez
7. **Notificaciones por email**: Notificar a usuarios sobre cambios de estado

---

**Fecha de implementación**: 2025-12-04
**Estado**: ✅ Implementado y funcional
**Build status**: ✅ Exitoso
