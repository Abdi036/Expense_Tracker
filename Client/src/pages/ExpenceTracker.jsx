import { useAuth } from "../utils/AuthContext";
import { useState, useEffect } from "react";

const ExpenceTracker = () => {
  const { fetchProducts, addProduct, editProduct, deleteProduct, products } =
    useAuth();

  const totalExpense = products.reduce(
    (acc, product) => acc + product.amount,
    0
  );

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Furniture",
    payment: "Credit Card",
  });

  const [editProductId, setEditProductId] = useState(null);
  const [editData, setEditData] = useState({
    description: "",
    amount: "",
    category: "",
    payment: "",
  });

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle changes to the form input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (editProductId) {
      setEditData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle the submission of the form to add a new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProduct(formData);
    setFormData({
      description: "",
      amount: "",
      category: "Furniture",
      payment: "Credit Card",
    });
  };

  // Save changes to product when pressing Enter
  const handleKeyPress = async (e, product) => {
    if (e.key === "Enter") {
      await editProduct(product._id, editData);
      setEditProductId(null);
    }
  };

  // Enable editing mode for the clicked product
  const handleEditClick = (product) => {
    setEditProductId(product._id);
    setEditData(product);
  };

  // Handle deleting a product
  const handleDelete = async (id) => {
    await deleteProduct(id);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Product Form to add new product */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-20">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="Furniture">Furniture</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Food">Food</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Payment Method
            </label>
            <select
              name="payment"
              value={formData.payment}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button
            type="submit"
            className="group relative flex justify-center border border-transparent text-sm bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white font-bold py-2 px-4 rounded"
          >
            Add Product
          </button>
        </form>

        {/* Error or Success Message */}
      </div>
      {/* Product List Table */}
      <h2 className="text-2xl font-bold mb-4 text-center">Your Products</h2>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {editProductId === product._id ? (
                      <input
                        type="text"
                        name="description"
                        value={editData.description}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span
                        onClick={() => handleEditClick(product)}
                        className="cursor-pointer"
                      >
                        {product.description}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {editProductId === product._id ? (
                      <input
                        type="number"
                        name="amount"
                        value={editData.amount}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <span
                        onClick={() => handleEditClick(product)}
                        className="cursor-pointer"
                      >
                        ${product.amount}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {editProductId === product._id ? (
                      <select
                        name="category"
                        value={editData.category}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="Furniture">Furniture</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Food">Food</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <span
                        onClick={() => handleEditClick(product)}
                        className="cursor-pointer"
                      >
                        {product.category}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {editProductId === product._id ? (
                      <select
                        name="payment"
                        value={editData.payment}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Others">Others</option>
                      </select>
                    ) : (
                      <span
                        onClick={() => handleEditClick(product)}
                        className="cursor-pointer"
                      >
                        {product.payment}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-white bg-red-600 p-3 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-5 text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-3xl ml-6">Total Expense:{totalExpense} $</div>
    </div>
  );
};

export default ExpenceTracker;
