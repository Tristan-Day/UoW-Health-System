const ALL_PERMISSIONS = `
  SELECT
    permission.name,
    permission.description
  FROM
    system.permissions permission
`
const SEARCH_PERMISSIONS =
  ALL_PERMISSIONS + " WHERE permission.name ILIKE '%' || $1 || '%'"

const USER_PERMISSIONS = `
  SELECT 
    perm.name,
    perm.description
  FROM 
    system.staff staff
  INNER JOIN 
    system.staff_permissions sp ON staff.staff_id = sp.staff_id
  INNER JOIN 
    system.permissions perm ON sp.permission_id = perm.permission_id
  WHERE 
    staff.staff_id = $1
  UNION
  SELECT 
    perm.name,
    perm.description
  FROM 
    system.staff staff
  INNER JOIN 
    system.staff_roles sr ON staff.staff_id = sr.staff_id
  INNER JOIN 
    system.roles role ON sr.role_id = role.role_id
  INNER JOIN  
    system.role_permissions rp ON role.role_id = rp.role_id
  INNER JOIN 
    system.permissions perm ON rp.permission_id = perm.permission_id
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
    system.permissions perm ON sp.permission_id = perm.permission_id
  WHERE 
    perm.name = $1
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
    system.roles role ON sr.role_id = role.role_id
  LEFT JOIN 
    system.role_permissions rp ON role.role_id = rp.role_id
  LEFT JOIN 
    system.permissions perm ON rp.permission_id = perm.permission_id
  WHERE 
    perm.name = $1
`

const USER_ROLES = `
  SELECT 
    role.name,
    role.description
  FROM
    system.staff staff
  INNER JOIN
      system.staff_roles assignment ON staff.staff_id = assignment.staff_id
  INNER JOIN 
      system.roles role ON assignment.role_id = role.role_id
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

const SEARCH_ROLES = ALL_ROLES + " WHERE role.name ILIKE '%' || $1 || '%'"

const ROLE_MEMBERS = `
  SELECT
    staff.staff_id,
    staff.first_name,
    staff.last_name 
  FROM
    system.staff staff
  LEFT JOIN
    system.staff_roles assignment ON staff.staff_id = assignment.staff_id
  LEFT JOIN 
    system.roles role ON assignment.role_id = role.role_id
  WHERE
    role.name  = $1
`

const ROLE_PERMISSIONS = `
  SELECT
    perm.name,
    perm.description
  FROM
    system.permissions perm
  LEFT JOIN
    system.role_permissions rp ON rp.permission_id = perm.permission_id
  LEFT JOIN
    system.roles role ON role.role_id = rp.role_id 
  WHERE
    role.name = $1
`

const permissions = {
  // Retreival
  all: ALL_PERMISSIONS,
  search: SEARCH_PERMISSIONS,

  // Security
  assigned: USER_PERMISSIONS,
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
