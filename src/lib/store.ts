// Simple localStorage-backed store for master data, tickets, and history
// This is a minimal in-memory persistence to enable a working MVP without a backend

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
export type Status = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
export type TicketType = 'IT' | 'Vehicle' | 'Admin'

export interface Company { companyCode: string; companyShortName: string; companyName: string }
export interface Location { locationID: string; companyCode: string; locationName: string }
export interface Category { categoryID: string; categoryName: string }
export interface Subcategory { subcategoryID: string; categoryID: string; subcategoryName: string }

export interface AssigneeMapping {
  mappingID: string
  empLocation: string
  department: string
  subDept: string
  subTask: string
  taskLabel: string
  ticketType: string
  assigneeEmpID: string
  isDisplay: boolean
}

export interface HistoryEntry {
  id: string
  ticketNumber: string
  userEmail: string
  actionType: 'Created' | 'Updated' | 'Status' | 'IT Acknowledged' | 'Auto-closed'
  field?: string
  before?: any
  after?: any
  comment?: string
  timestamp: string // ISO
}

export interface Ticket {
  ticketNumber: string
  type: TicketType
  title: string
  description?: string
  priority: Priority
  status: Status
  department?: string
  subDepartment?: string
  category?: string
  subcategory?: string
  location?: string
  assigneeEmpID?: string
  assigneeName?: string
  reporterEmail: string
  reporterName?: string
  expectedCompletion?: string // ISO date
  createdAt: string // ISO
  details?: Record<string, any> // extra form-specific fields (vehicle/admin)
}

const KEYS = {
  companies: 'spot_companies',
  locations: 'spot_locations',
  categories: 'spot_categories',
  subcategories: 'spot_subcategories',
  assignees: 'spot_assignee_mappings',
  tickets: 'spot_tickets',
  history: 'spot_history',
  counter: 'spot_ticket_counter',
}

// Generic helpers
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Masters
export const Masters = {
  getCompanies(): Company[] { return read<Company[]>(KEYS.companies, []) },
  setCompanies(v: Company[]) { write(KEYS.companies, v) },

  getLocations(): Location[] { return read<Location[]>(KEYS.locations, []) },
  setLocations(v: Location[]) { write(KEYS.locations, v) },

  getCategories(): Category[] { return read<Category[]>(KEYS.categories, []) },
  setCategories(v: Category[]) { write(KEYS.categories, v) },

  getSubcategories(): Subcategory[] { return read<Subcategory[]>(KEYS.subcategories, []) },
  setSubcategories(v: Subcategory[]) { write(KEYS.subcategories, v) },

  getAssigneeMappings(): AssigneeMapping[] { return read<AssigneeMapping[]>(KEYS.assignees, []) },
  setAssigneeMappings(v: AssigneeMapping[]) { write(KEYS.assignees, v) },
}

// Tickets & History
export const TicketsStore = {
  getAll(): Ticket[] { return read<Ticket[]>(KEYS.tickets, []) },
  setAll(v: Ticket[]) { write(KEYS.tickets, v) },
  getHistory(ticketNumber: string): HistoryEntry[] {
    const all = read<Record<string, HistoryEntry[]>>(KEYS.history, {})
    return all[ticketNumber] || []
  },
  setHistory(ticketNumber: string, items: HistoryEntry[]) {
    const all = read<Record<string, HistoryEntry[]>>(KEYS.history, {})
    all[ticketNumber] = items
    write(KEYS.history, all)
  },
}

function nextTicketNumber(): string {
  const current = Number(localStorage.getItem(KEYS.counter) || '0') + 1
  localStorage.setItem(KEYS.counter, String(current))
  const year = new Date().getFullYear()
  return `TK-${year}-${String(current).padStart(4, '0')}`
}

function findAssignee(input: {
  ticketType: TicketType
  department?: string
  subDepartment?: string
  location?: string
  category?: string
}): { assigneeEmpID?: string } {
  const maps = Masters.getAssigneeMappings().filter(m => m.isDisplay)
  // naive scoring: each matching field adds score, highest wins
  let best: { score: number; emp?: string } = { score: -1 }
  for (const m of maps) {
    let score = 0
    if (m.ticketType?.toLowerCase() === input.ticketType.toLowerCase()) score += 2
    if (input.department && m.department === input.department) score += 2
    if (input.subDepartment && m.subDept === input.subDepartment) score += 1
    if (input.location && m.empLocation === input.location) score += 2
    if (input.category && (m.taskLabel === input.category || m.subTask === input.category)) score += 1
    if (score > best.score) best = { score, emp: m.assigneeEmpID }
  }
  return { assigneeEmpID: best.emp }
}

export function createTicket(params: Omit<Ticket, 'ticketNumber' | 'status' | 'createdAt' | 'assigneeEmpID'> & { status?: Status }) {
  const ticketNumber = nextTicketNumber()
  const createdAt = new Date().toISOString()
  const { assigneeEmpID } = findAssignee({
    ticketType: params.type,
    department: params.department,
    subDepartment: params.subDepartment,
    location: params.location,
    category: params.category,
  })

  const ticket: Ticket = {
    ticketNumber,
    type: params.type,
    title: params.title,
    description: params.description,
    priority: params.priority,
    status: params.status || 'Open',
    department: params.department,
    subDepartment: params.subDepartment,
    category: params.category,
    subcategory: params.subcategory,
    location: params.location,
    assigneeEmpID,
    reporterEmail: params.reporterEmail,
    reporterName: params.reporterName,
    expectedCompletion: params.expectedCompletion,
    createdAt,
    details: params.details || {},
  }

  const all = TicketsStore.getAll()
  TicketsStore.setAll([ticket, ...all])
  addHistory(ticketNumber, {
    actionType: 'Created',
    userEmail: params.reporterEmail,
    after: { status: ticket.status, assigneeEmpID },
    comment: `${params.type} ticket created`,
  })
  return ticket
}

export function updateTicket(ticketNumber: string, changes: Partial<Ticket>, actorEmail: string, comment?: string) {
  const all = TicketsStore.getAll()
  const idx = all.findIndex(t => t.ticketNumber === ticketNumber)
  if (idx === -1) return
  const before = all[idx]
  const updated = { ...before, ...changes }
  TicketsStore.setAll([updated, ...all.filter((_, i) => i !== idx)])

  // record changes field-by-field
  Object.keys(changes).forEach((key) => {
    const k = key as keyof Ticket
    const beforeVal = (before as any)[k]
    const afterVal = (updated as any)[k]
    if (beforeVal !== afterVal) {
      addHistory(ticketNumber, {
        actionType: key === 'status' ? 'Status' : 'Updated',
        userEmail: actorEmail,
        field: key,
        before: beforeVal,
        after: afterVal,
        comment,
      })
    }
  })
}

export function addHistory(ticketNumber: string, entry: Omit<HistoryEntry, 'id' | 'ticketNumber' | 'timestamp'>) {
  const items = TicketsStore.getHistory(ticketNumber)
  const toAdd: HistoryEntry = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
    ticketNumber,
    timestamp: new Date().toISOString(),
    ...entry,
  }
  TicketsStore.setHistory(ticketNumber, [toAdd, ...items])
}

export function autoCloseResolvedTickets() {
  const all = TicketsStore.getAll()
  const now = Date.now()
  const updated: Ticket[] = []
  let changed = false
  for (const t of all) {
    if (t.status === 'Resolved') {
      const lastResolved = (TicketsStore.getHistory(t.ticketNumber).find(h => h.actionType === 'Status' && h.after === 'Resolved')?.timestamp) || t.createdAt
      const days = (now - new Date(lastResolved).getTime()) / (1000 * 60 * 60 * 24)
      if (days >= 5) {
        t.status = 'Closed'
        changed = true
        addHistory(t.ticketNumber, { actionType: 'Auto-closed', userEmail: 'system@spot', comment: 'Auto-closed after 5 days' })
      }
    }
    updated.push(t)
  }
  if (changed) TicketsStore.setAll(updated)
}

export function seedDefaults() {
  if (Masters.getCompanies().length === 0) {
    Masters.setCompanies([
      { companyCode: 'PEL', companyShortName: 'PEL', companyName: 'Premier Enterprises Ltd' },
      { companyCode: 'TECH', companyShortName: 'TechCorp', companyName: 'Technology Corporation Ltd.' },
    ])
  }
  if (Masters.getLocations().length === 0) {
    Masters.setLocations([
      { locationID: 'LOC001', companyCode: 'PEL', locationName: 'Head Office' },
      { locationID: 'LOC002', companyCode: 'PEL', locationName: 'Plant A' },
      { locationID: 'LOC003', companyCode: 'PEL', locationName: 'Warehouse' },
    ])
  }
  if (Masters.getCategories().length === 0) {
    Masters.setCategories([
      { categoryID: 'CAT001', categoryName: 'Hardware' },
      { categoryID: 'CAT002', categoryName: 'Software' },
      { categoryID: 'CAT003', categoryName: 'Network' },
    ])
  }
  if (Masters.getSubcategories().length === 0) {
    Masters.setSubcategories([
      { subcategoryID: 'SUB001', categoryID: 'CAT001', subcategoryName: 'Laptop' },
      { subcategoryID: 'SUB002', categoryID: 'CAT001', subcategoryName: 'Printer' },
      { subcategoryID: 'SUB003', categoryID: 'CAT002', subcategoryName: 'Installation' },
      { subcategoryID: 'SUB004', categoryID: 'CAT003', subcategoryName: 'Connectivity' },
    ])
  }
  if (Masters.getAssigneeMappings().length === 0) {
    Masters.setAssigneeMappings([
      { mappingID: 'MAP001', empLocation: 'Head Office', department: 'IT', subDept: 'Network', subTask: 'Connectivity', taskLabel: 'Network', ticketType: 'IT', assigneeEmpID: 'it@pel.com', isDisplay: true },
      { mappingID: 'MAP002', empLocation: 'Plant A', department: 'Administration', subDept: 'Transport', subTask: 'Vehicle', taskLabel: 'Vehicle', ticketType: 'Vehicle', assigneeEmpID: 'fleet@pel.com', isDisplay: true },
      { mappingID: 'MAP003', empLocation: 'Head Office', department: 'Administration', subDept: 'Services', subTask: 'General', taskLabel: 'Admin Service', ticketType: 'Admin', assigneeEmpID: 'admin@pel.com', isDisplay: true },
    ])
  }
}

