import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/table'
import StaffService from '../../../services/StaffService'
import Spinner from '../../../components/Spinner/Spinner'
import { useModal } from '../../../hooks/useModal'
import Modal from '../../../components/Modal'
import FloatingLabelInput from '../../../components/Inputs/FloatingLabelInput'
import FloatingLabelSelect from '../../../components/Select/FloatingLabelSelect'
import SubmitButton from '../../../components/Button/SubmitButton'

interface Staff {
  user_id: number
  full_name: string
  username: string
  role: string
}

interface Props {
  refreshKey: boolean
  onAction: (msg: string, failed?: boolean) => void
  triggerRefresh: () => void
}

const StaffList = ({ refreshKey, onAction, triggerRefresh }: Props) => {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const addModal = useModal()
  const [form, setForm] = useState({ full_name: '', username: '', password: '', password_confirmation: '', role: 'staff' })
  const [submitLoading, setSubmitLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    StaffService.loadStaff().then((res) => setStaff(res.data.staff || [])).finally(() => setLoading(false))
  }, [refreshKey])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    try {
      const res = await StaffService.storeStaff(form)
      onAction(res.data.message)
      addModal.closeModal()
      setForm({ full_name: '', username: '', password: '', password_confirmation: '', role: 'staff' })
      triggerRefresh()
    } catch {
      onAction('Failed to add staff', true)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this staff member?')) return
    const res = await StaffService.destroyStaff(id)
    onAction(res.data.message)
    triggerRefresh()
  }

  return (
    <>
      <button onClick={() => addModal.openModal()} className="mb-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">+ Add Staff</button>
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader className="bg-orange-600 text-white text-xs">
            <TableRow>
              <TableCell isHeader className="px-4 py-3">Name</TableCell>
              <TableCell isHeader className="px-4 py-3">Username</TableCell>
              <TableCell isHeader className="px-4 py-3">Role</TableCell>
              <TableCell isHeader className="px-4 py-3">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm divide-y">
            {loading ? (
              <TableRow><TableCell colSpan={4} className="py-6"><Spinner /></TableCell></TableRow>
            ) : staff.map((s) => (
              <TableRow key={s.user_id}>
                <TableCell className="px-4 py-3">{s.full_name}</TableCell>
                <TableCell className="px-4 py-3">{s.username}</TableCell>
                <TableCell className="px-4 py-3 capitalize">{s.role}</TableCell>
                <TableCell className="px-4 py-3">
                  <button onClick={() => handleDelete(s.user_id)} className="text-red-600 hover:underline">Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Modal isOpen={addModal.isOpen} onClose={addModal.closeModal} title="Add Staff">
        <form onSubmit={handleAdd} className="space-y-4">
          <FloatingLabelInput label="Full Name" name="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
          <FloatingLabelInput label="Username" name="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <FloatingLabelInput label="Password" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <FloatingLabelInput label="Confirm Password" name="password_confirmation" type="password" value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required />
          <FloatingLabelSelect label="Role" name="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} options={[{ value: 'owner', label: 'Owner' }, { value: 'staff', label: 'Staff' }]} required />
          <SubmitButton label="Save Staff" loading={submitLoading} />
        </form>
      </Modal>
    </>
  )
}

export default StaffList
