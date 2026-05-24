import { useEffect, useState, type FC } from 'react'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/table'
import CategoryService from '../../../services/CategoryService'
import Spinner from '../../../components/Spinner/Spinner'
import type { CategoryColumns } from '../../../interfaces/CategoryColumns'

const CategoryList: FC<{ refreshKey: boolean }> = ({ refreshKey }) => {
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryColumns[]>([])

  useEffect(() => {
    setLoading(true)
    CategoryService.loadCategories()
      .then((res) => setCategories(res.data.categories || []))
      .finally(() => setLoading(false))
  }, [refreshKey])

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <h2 className="font-semibold p-4 border-b">Category List</h2>
      <Table>
        <TableHeader className="bg-orange-600 text-white text-xs">
          <TableRow>
            <TableCell isHeader className="px-4 py-3 text-center">No.</TableCell>
            <TableCell isHeader className="px-4 py-3 text-center">Category</TableCell>
            <TableCell isHeader className="px-4 py-3 text-center">Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y text-sm">
          {loading ? (
            <TableRow><TableCell colSpan={3} className="py-6"><Spinner /></TableCell></TableRow>
          ) : categories.length ? (
            categories.map((cat, i) => (
              <TableRow key={cat.category_id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3 text-center">{i + 1}</TableCell>
                <TableCell className="px-4 py-3 text-center">{cat.category_name}</TableCell>
                <TableCell className="px-4 py-3 text-center gap-4">
                  <Link to={`/category/edit/${cat.category_id}`} className="text-green-600 hover:underline mr-3">Edit</Link>
                  <Link to={`/category/delete/${cat.category_id}`} className="text-red-600 hover:underline">Delete</Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={3} className="py-6 text-center text-gray-500">No categories found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default CategoryList
