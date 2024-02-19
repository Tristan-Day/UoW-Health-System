const ALL_PERMISSIONS = `
  SELECT 
    pe.name,
    pe.description
  FROM 
    system.staff staff
  LEFT JOIN 
    system.staff_permissions sp ON staff.staff_id = sp.staff_id
  LEFT JOIN 
    system.permissions pe ON sp.permission_id = pe.permission_id
  WHERE 
    staff.staff_id = $1
  UNION
  SELECT 
    pe.name,
    pe.description
  FROM 
    system.staff staff
  LEFT JOIN 
    system.staff_roles sr ON staff.staff_id = sr.staff_id
  LEFT JOIN 
    system.roles ro ON sr.role_id = ro.role_id
  LEFT JOIN 
    system.role_permissions rp ON ro.role_id = rp.role_id
  LEFT JOIN 
    system.permissions pe ON rp.permission_id = pe.permission_id
  WHERE 
    staff.staff_id = $1
  `

const PERMISSION_MEMBERS = `
  SELECT 
    staff.staff_id,
    staff.first_name,
    staff.last_name 
  FROM 
    system.staff staff
  LEFT JOIN 
    system.staff_permissions sp ON staff.staff_id = sp.staff_id
  LEFT JOIN 
    system.permissions pe ON sp.permission_id = pe.permission_id
  WHERE 
    pe.name = $1
  UNION
  SELECT 
    staff.staff_id,
    staff.first_name,
    staff.last_name 
  FROM 
    system.staff staff
  LEFT JOIN 
    system.staff_roles sr ON staff.staff_id = sr.staff_id
  LEFT JOIN 
    system.roles ro ON sr.role_id = ro.role_id
  LEFT JOIN 
    system.role_permissions rp ON ro.role_id = rp.role_id
  LEFT JOIN 
    system.permissions pe ON rp.permission_id = pe.permission_id
  WHERE 
    pe.name = $1
`

const USER_ROLES = `
  SELECT
    ro.name,
    ro.description
  FROM
    system.staff staff
  LEFT JOIN
    system.staff_roles sr ON staff.staff_id = sr.staff_id
  LEFT JOIN 
    system.roles ro ON sr.role_id = ro.role_id
  WHERE
    staff.staff_id = $1
  `

const ALL_ROLES = `
  SELECT
    role.name,
    role.description
  FROM
    system.roles role
`

const SEARCH_ROLES = `
  SELECT
    role.name,
    role.description
  FROM
    system.roles role
  WHERE
    role.name = $1
`

const ROLE_MEMBERS = `
  SELECT
    staff.staff_id,
    staff.first_name,
    staff.last_name 
  FROM
    system.staff staff
  LEFT JOIN
    system.staff_roles sr ON staff.staff_id = sr.staff_id
  LEFT JOIN 
    system.roles ro ON sr.role_id = ro.role_id
  WHERE
    ro.name  = $1
`

const ROLE_PERMISSIONS = `
  SELECT
    permissions.name,
    permissions.description
  FROM
    system.permissions permissions
  LEFT JOIN
    system.role_permissions rp ON rp.permission_id = permissions.permission_id
  LEFT JOIN
    system.roles ro ON ro.role_id = rp.role_id 
  WHERE
    ro.name = $1
`

const permissions = {
  all: ALL_PERMISSIONS,
  members: PERMISSION_MEMBERS
}

const roles = {
  // Retreival
  all: ALL_ROLES,
  search: SEARCH_ROLES,

  // Security
  members: ROLE_MEMBERS,
  assigned: USER_ROLES,

  // View
  permissions: ROLE_PERMISSIONS
}

// Export the permissions object
module.exports = { permissions, roles }
