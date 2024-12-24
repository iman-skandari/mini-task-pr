import { configureStore } from '@reduxjs/toolkit';
import dataReducer, { addProduct, updateProduct, setProducts } from './correctDataSlice'; // اطمینان حاصل کنید که مسیر درست است

const store = configureStore({
    reducer: {
        data: dataReducer, // ریدوسر برای مدیریت داده‌ها
    },
});

// صادرات اکشن‌ها
export { addProduct, updateProduct, setProducts };
export default store; 