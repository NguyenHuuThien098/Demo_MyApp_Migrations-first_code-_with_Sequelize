# **Node.js Project with Sequelize and TypeScript**

## **Giới thiệu**
Dự án này là một ứng dụng Node.js sử dụng **Sequelize** làm ORM, **TypeScript** để phát triển, và được tổ chức theo mô hình **MVC** (Model-View-Controller). Ứng dụng hỗ trợ quản lý các bảng như `Products`, `Shippers`, `Customers`, `Orders`, và `OrderDetails`.

---

## **Cấu trúc thư mục**
```
src/
├── config/                     # Cấu hình cơ sở dữ liệu
│   └── database.ts             # Kết nối cơ sở dữ liệu
├── controller/                 # Xử lý yêu cầu HTTP
│   ├── product/                # Controller cho Products
│   ├── shipper/                # Controller cho Shippers
│   ├── customer/               # Controller cho Customers
│   ├── order/                  # Controller cho Orders
│   └── orderDetail/            # Controller cho OrderDetails
├── models/                     # Định nghĩa các bảng trong cơ sở dữ liệu
│   ├── product.ts              # Model cho bảng Products
│   ├── shipper.ts              # Model cho bảng Shippers
│   ├── customer.ts             # Model cho bảng Customers
│   ├── order.ts                # Model cho bảng Orders
│   ├── orderdetail.ts          # Model cho bảng OrderDetails
│   └── index.ts                # Tự động load tất cả các models
├── repository/                 # Tương tác trực tiếp với cơ sở dữ liệu
│   ├── productRepository.ts    # Repository cho Products
│   ├── shipperRepository.ts    # Repository cho Shippers
│   ├── customerRepository.ts   # Repository cho Customers
│   ├── orderRepository.ts      # Repository cho Orders
│   └── orderDetailRepository.ts # Repository cho OrderDetails
├── routes/                     # Định nghĩa các route
│   ├── productRoutes.ts        # Route cho Products
│   ├── shipperRoutes.ts        # Route cho Shippers
│   ├── customerRoutes.ts       # Route cho Customers
│   ├── orderRoutes.ts          # Route cho Orders
│   └── orderDetailRoutes.ts    # Route cho OrderDetails
├── services/                   # Xử lý logic nghiệp vụ
│   ├── productService.ts       # Service cho Products
│   ├── shipperService.ts       # Service cho Shippers
│   ├── customerService.ts      # Service cho Customers
│   ├── orderService.ts         # Service cho Orders
│   └── orderDetailService.ts   # Service cho OrderDetails
├── app.ts                      # Tệp chính của ứng dụng
├── migrations/                 # Các file migration của Sequelize
├── seeders/                    # Các file seeder để thêm dữ liệu mẫu
└── .env                        # Tệp cấu hình môi trường
```

---

## **Yêu cầu hệ thống**
- **Node.js**: >= 14.x
- **npm**: >= 6.x
- **MySQL**: >= 5.7

---

## **Cài đặt**

### **1. Clone repository**
```bash
git clone <repository-url>
cd <project-folder>
```

### **2. Cài đặt các package**
```bash
npm install
```

### **3. Cấu hình môi trường**
Tạo file `.env` trong thư mục gốc và thêm các thông tin sau:
```properties
DB_USERNAME=<tên người dùng cơ sở dữ liệu>
DB_PASSWORD=<mật khẩu cơ sở dữ liệu>
DB_DATABASE=<tên cơ sở dữ liệu>
DB_HOST=127.0.0.1
DB_DIALECT=mysql
PORT=8080
```

### **4. Thiết lập cơ sở dữ liệu**
#### **4.1. Tạo cơ sở dữ liệu**
Sử dụng MySQL Workbench hoặc dòng lệnh để tạo cơ sở dữ liệu:
```sql
CREATE DATABASE <tên cơ sở dữ liệu>;
```

#### **4.2. Chạy migration**
Chạy lệnh sau để tạo các bảng trong cơ sở dữ liệu:
```bash
npx sequelize-cli db:migrate
```

#### **4.3. Thêm dữ liệu mẫu**
Chạy lệnh sau để thêm dữ liệu mẫu vào cơ sở dữ liệu:
```bash
npx sequelize-cli db:seed:all
```

---

## **Chạy ứng dụng**
Chạy ứng dụng ở chế độ phát triển:
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: [http://localhost:8080](http://localhost:8080)

---

## **API Endpoints**

### **Products**
- **GET /products**: Lấy danh sách tất cả sản phẩm.
- **GET /products/:id**: Lấy thông tin chi tiết của một sản phẩm.
- **POST /products**: Thêm sản phẩm mới.
- **PUT /products/:id**: Sửa thông tin sản phẩm theo ID.
- **DELETE /products/:id**: Xóa sản phẩm theo ID.

### **Shippers**
- **GET /shippers**: Lấy danh sách tất cả shipper.
- **GET /shippers/:id**: Lấy thông tin chi tiết của một shipper.
- **POST /shippers**: Thêm shipper mới.
- **PUT /shippers/:id**: Sửa thông tin shipper theo ID.
- **DELETE /shippers/:id**: Xóa shipper theo ID.

### **Customers**
- **GET /customers**: Lấy danh sách tất cả khách hàng.
- **GET /customers/:id**: Lấy thông tin chi tiết của một khách hàng.
- **POST /customers**: Thêm khách hàng mới.
- **DELETE /customers/:id**: Xóa khách hàng theo ID.

### **Orders**
- **GET /orders**: Lấy danh sách tất cả đơn hàng.
- **GET /orders/:id**: Lấy thông tin chi tiết của một đơn hàng.
- **POST /orders**: Thêm đơn hàng mới.
- **DELETE /orders/:id**: Xóa đơn hàng theo ID.

### **OrderDetails**
- **GET /orderdetails**: Lấy danh sách tất cả chi tiết đơn hàng.
- **GET /orderdetails/:id**: Lấy thông tin chi tiết của một chi tiết đơn hàng.
- **POST /orderdetails**: Thêm chi tiết đơn hàng mới.
- **DELETE /orderdetails/:id**: Xóa chi tiết đơn hàng theo ID.

---

## **Scripts**
- **`npm run dev`**: Chạy ứng dụng ở chế độ phát triển.
- **`npm run build`**: Biên dịch TypeScript sang JavaScript.
- **`npm start`**: Chạy ứng dụng ở chế độ sản xuất.
- **`npx sequelize-cli db:migrate`**: Chạy migration để tạo bảng.
- **`npx sequelize-cli db:seed:all`**: Thêm dữ liệu mẫu vào cơ sở dữ liệu.
- **`npx sequelize-cli db:seed:undo:all`**: Xóa dữ liệu mẫu khỏi cơ sở dữ liệu.

---

## **Ghi chú**
- Đảm bảo rằng bạn đã cấu hình đúng file `.env` trước khi chạy ứng dụng.
- Nếu gặp lỗi kết nối cơ sở dữ liệu, kiểm tra lại thông tin trong file `.env` và đảm bảo rằng cơ sở dữ liệu MySQL đang chạy.

---

## **Liên hệ**
Nếu bạn có bất kỳ câu hỏi hoặc vấn đề nào, vui lòng liên hệ qua email: [thiennguyenhuu3@gmail.com](mailto:thiennguyenhuu3@gmail.com).