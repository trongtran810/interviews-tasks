# BÀI TEST VÒNG 1
Kiến thức vị trí Lập trình viên Phần mềm Web

Số: 20231123

## Bài 1: 
Cho liên kết đơn: x1 -> x2 -> x3 -> ... -> xn

Hãy tìm thuật toán để chuyển thành:

x1 -> xn -> x2 -> xn-1 -> x3 -> ... 

(Thuật toán có chi phí càng thấp thì điểm càng cao)

## Bài 2: 
Tạo 1 Drag&Drop container đọc file văn bản (.txt) người dùng kéo thả vào và thống kê ra tổng số từ khác nhau xuất hiện trong file văn bản và 3 từ được lặp lại nhiều nhất cùng số lần lặp lại của 3 từ đó. (Lưu ý không phân biệt chữ hoa hay chữ thường)

File văn bản chỉ sử dụng ký tự alphabet, không chứa số.

File văn bản chỉ chứa các ký tự đặc biệt sau:
chấm (.)
phẩy (,)
khoảng trắng ( )

Yêu cầu:
Nếu không phải file có đuôi định dạng “.txt” sẽ báo lỗi.

Nếu file có ít hơn 3 từ khác nhau sẽ báo lỗi.

Kiểm tra các yêu cầu của file văn bản theo mô tả ở trên nếu không thoả mãn sẽ báo lỗi.

Sử dụng Web worker để xử lý văn bản.

## Bài 3: 
Cho bảng "customers" với các trường: "id", "name" và "email", và bảng "orders" với các trường: "id", "customer_id", "order_date" và "total”. 
Viết truy vấn SQL để lấy danh sách khách hàng đã đặt hàng ít nhất một lần nhưng chưa từng đặt hàng nhiều hơn 100$

