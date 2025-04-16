export class OrderDetailDto {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    productName: string;
    customerName: string; // Thêm trường customerName
    // customerContactName: string; // Thêm trường customerContactName
    // customerCountry: string; // Thêm trường customerCountry

    constructor(data: any) {
        this.id = data.orderDetailId || data.id;
        this.orderId = data.orderId;
        this.productId = data.productId;
        this.quantity = data.quantity;
        this.price = data.price;
        this.productName = data.productName || '';
        this.customerName = data.customerName || ''; // Lấy tên khách hàng
        // this.customerContactName = data.customerContactName || ''; // Lấy tên liên hệ khách hàng
        // this.customerCountry = data.customerCountry || ''; // Lấy quốc gia khách hàng
    }
}