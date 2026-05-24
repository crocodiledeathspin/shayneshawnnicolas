import { useEffect, useState, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/table'
import ProductService from '../../../services/ProductService'
import Spinner from '../../../components/Spinner/Spinner'
import type { ProductColumns } from '../../../interfaces/ProductColumns'
import { useModal } from '../../../hooks/useModal'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'
import DeleteProductModal from './DeleteProductModal'

interface Props {
  refreshKey: boolean
  onAction: (msg: string, failed?: boolean) => void
  triggerRefresh: () => void
}

const ProductList = ({ refreshKey, onAction, triggerRefresh }: Props) => {
  const [products, setProducts] = useState<ProductColumns[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const addModal = useModal()
  const editModal = useModal<ProductColumns>()
  const deleteModal = useModal<ProductColumns>()

  const loadProducts = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true)
    try {
      const res = await ProductService.loadProducts(pageNum, search)
      const newProducts = res.data.products || []
      setProducts((prev) => (append ? [...prev, ...newProducts] : newProducts))
      setHasMore(res.data.has_more_pages)
      setPage(res.data.current_page)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { loadProducts(1) }, [refreshKey, search])

  const handleSuccess = (msg: string) => {
    onAction(msg)
    triggerRefresh()
    loadProducts(1)
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[200px]"
        />
        <button onClick={() => addModal.openModal()} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          + Add Product
        </button>
      </div>
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader className="bg-orange-600 text-white text-xs">
            <TableRow>
              <TableCell isHeader className="px-3 py-3">Product</TableCell>
              <TableCell isHeader className="px-3 py-3">Category</TableCell>
              <TableCell isHeader className="px-3 py-3">Price</TableCell>
              <TableCell isHeader className="px-3 py-3">Stock</TableCell>
              <TableCell isHeader className="px-3 py-3">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm divide-y">
            {loading && !products.length ? (
              <TableRow><TableCell colSpan={5} className="py-6"><Spinner /></TableCell></TableRow>
            ) : products.length ? (
              products.map((p) => (
                <TableRow key={p.product_id} className={p.is_low_stock ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <TableCell className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      {p.product_image && <img src={p.product_image} alt="" className="w-8 h-8 rounded object-cover" />}
                      <span>{p.product_name}{p.is_low_stock && <span className="ml-1 text-xs text-red-600">(Low)</span>}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3">{p.category?.category_name}</TableCell>
                  <TableCell className="px-3 py-3">₱{Number(p.price).toFixed(2)}</TableCell>
                  <TableCell className="px-3 py-3">{p.stock_qty} {p.unit}</TableCell>
                  <TableCell className="px-3 py-3">
                    <button onClick={() => editModal.openModal(p)} className="text-green-600 hover:underline mr-3">Edit</button>
                    <button onClick={() => deleteModal.openModal(p)} className="text-red-600 hover:underline">Delete</button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="py-6 text-center text-gray-500">No products found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        {hasMore && (
          <div className="p-4 text-center">
            <button onClick={() => loadProducts(page + 1, true)} className="text-orange-600 hover:underline" disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
      <AddProductModal isOpen={addModal.isOpen} onClose={addModal.closeModal} onSuccess={handleSuccess} />
      <EditProductModal isOpen={editModal.isOpen} product={editModal.selectedItem} onClose={editModal.closeModal} onSuccess={handleSuccess} />
      <DeleteProductModal isOpen={deleteModal.isOpen} product={deleteModal.selectedItem} onClose={deleteModal.closeModal} onSuccess={handleSuccess} />
    </>
  )
}

export default ProductList
