import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, updateProduct, addProduct } from "../../store/store";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
} from "@mui/material";
import "./style.css";
const DataGrid = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.data.products);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);
  const [sortColumn, setSortColumn] = React.useState("");
  const [sortDirection, setSortDirection] = React.useState("asc");
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const displayedItems = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  const [editItem, setEditItem] = React.useState(null);
  const [formData, setFormData] = React.useState({
    price: "",
    category: "",
    brand: "",
    title: "",
  });
  const [sortConfig, setSortConfig] = React.useState({ key: 'title', direction: 'ascending' });
  const [sortType, setSortType] = React.useState('A-Z');

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...displayedItems];
    sortableItems.sort((a, b) => {
      const aValue = isNaN(a[sortConfig.key]) ? a[sortConfig.key].toLowerCase() : parseFloat(a[sortConfig.key]);
      const bValue = isNaN(b[sortConfig.key]) ? b[sortConfig.key].toLowerCase() : parseFloat(b[sortConfig.key]);

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [displayedItems, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://dummyjson.com/products");
      dispatch(setProducts(response.data.products));
    };

    const fetchColumns = async () => {
      try {
        const response = await fetch("/columns.json"); // مسیر فایل JSON
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text(); // دریافت محتوای پاسخ به صورت متن
          throw new Error(`Received non-JSON response: ${text}`); // چاپ محتوای پاسخ
        }
        const columnsData = await response.json();
        if (Array.isArray(columnsData)) {
          setColumns(columnsData); // ذخیره ستون‌ها
        } else {
          console.error("Columns data is not an array:", columnsData);
        }
      } catch (error) {
        console.error("Error fetching columns:", error.message);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      price: item.price,
      category: item.category,
      brand: item.brand,
      title: item.title,
    });
  };

  const handleSave = () => {
    const updatedProducts = products.map((prod) =>
      prod.id === editItem.id ? { ...prod, ...formData } : prod
    );
    dispatch(setProducts(updatedProducts));
    setEditItem(null);
  };

  const handleAdd = () => {
    const newProduct = { id: Date.now(), title: "New Product", price: 100 }; // به‌عنوان مثال
    dispatch(addProduct(newProduct));
  };

  const handleSort = (columnId) => {
    const direction =
      sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc";
    const sortedProducts = [...products].sort((a, b) => {
      if (a[columnId] < b[columnId]) return direction === "asc" ? -1 : 1;
      if (a[columnId] > b[columnId]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    dispatch(setProducts(sortedProducts));
    setSortColumn(columnId);
    setSortDirection(direction);
  };

  const handleSortTypeChange = (event) => {
    setSortType(event.target.value);
    setSortConfig({ key: sortConfig.key, direction: event.target.value === 'A-Z' ? 'ascending' : 'descending' });
  };

  return (
    <div>
      <h1>Products List</h1>
      <p>Current Sort: {sortConfig.direction === 'ascending' ? 'Ascending' : 'Descending'} by {sortConfig.key}</p>
      <select value={sortType} onChange={handleSortTypeChange}>
        <option value="A-Z">A to Z</option>
        <option value="Z-A">Z to A</option>
      </select>
      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('title')}>Title</th>
            <th onClick={() => requestSort('price')}>Price</th>
            <th onClick={() => requestSort('category')}>Category</th>
            <th onClick={() => requestSort('brand')}>Brand</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map(item => (
            <tr key={item.id}>
              {editItem && editItem.id === item.id ? (
                <td colSpan={5}>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                  <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                  <input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                  <button onClick={handleSave}>Save</button>
                </td>
              ) : (
                <>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        rowsPerPageOptions={[5, 6, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={itemsPerPage}
        page={currentPage}
        onPageChange={(event, newPage) => setCurrentPage(newPage)}
        onRowsPerPageChange={(event) =>
          setItemsPerPage(parseInt(event.target.value, 10))
        }
      />
    </div>
  );
};

export default DataGrid;
