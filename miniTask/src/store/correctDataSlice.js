import { createSlice } from '@reduxjs/toolkit';

// ایجاد یک slice برای مدیریت داده‌ها
const correctDataSlice = createSlice({
    name: 'correctData',
    initialState: {
        products: [], // وضعیت اولیه محصولات
    },
    reducers: {
        addProduct: (state, action) => {
            state.products.push(action.payload); // اضافه کردن محصول جدید
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(product => product.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = action.payload; // به‌روزرسانی محصول
            }
        },
        setProducts: (state, action) => {
            state.products = action.payload; // تنظیم محصولات
        },
    },
});

// صادرات اکشن‌ها و ریدوسر
export const { addProduct, updateProduct, setProducts } = correctDataSlice.actions;
export default correctDataSlice.reducer;
