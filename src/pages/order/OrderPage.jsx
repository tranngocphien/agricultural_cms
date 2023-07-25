import { filter } from 'lodash';
import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Stack,
  Paper,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  DialogTitle,
  Button,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import { ProductList } from '../../sections/@dashboard/products';
import axios from '../../data/httpCommon';
import { formatCurrency } from '../../utils/formatNumber';
import { formatImageUrl } from '../../utils/formatUrl';

const TABLE_HEAD = [
  { id: 'id', label: 'Mã đơn hàng', alignRight: false },
  { id: 'username', label: 'Tên khách hàng', alignRight: false },
  { id: 'amount', label: 'Tổng tiền', alignRight: false },
  { id: 'shippingFee', label: 'Phí giao hàng', alignRight: false },
  { id: 'shippingAddress', label: 'Địa chỉ giao hàng', alignRight: false },
  { id: 'phoneNumber', label: 'Số điện thoại', alignRight: false },
  { id: 'status', label: 'Trạng thái', alignRight: false },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OrderPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [totalOrder, setTotalOrder] = useState(10);

  const [newsStatus, setNewsStatus] = useState('IDLE');

  const [openDetail, setOpenDetail] = useState(false);

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [orders, setOrders] = useState([]);

  const handleCloseDetail = (event) => {
    setOpenDetail(false);
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    axios.get(`/api/admin/orders?page=${page}&size=${rowsPerPage}`).then((response) => {
      setOrders(response.data.data);
      setSelectedOrder(response.data.data[0]);
      setTotalOrder(response.data.paginationInfo.totalElement);
      console.log(response);
    });
  }, []);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    console.log(newPage);
    axios.get(`/api/admin/orders?page=${newPage}&size=${rowsPerPage}`).then((response) => {
      setOrders(response.data.data);
      setSelectedOrder(response.data.data[0]);
      console.log(response);
    });
  };

  const handleChangeRowsPerPage = async (event) => {
    console.log(event);
    setPage(0);
    setRowsPerPage(event.target.value);
  
    console.log(`/api/admin/orders?page=${page}&size=${rowsPerPage}`);
    axios.get(`/api/admin/orders?page=${page}&size=${event.target.value}`).then((response) => {
      setOrders(response.data.data);
      setSelectedOrder(response.data.data[0]);
      console.log(response);
    });
    console.log(orders);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDetailOrder = (event, order) => {
    setSelectedOrder(order);
    setNewsStatus(order.status);
    setOpenDetail(true);
  };

  const updateStatus = async () => {
    try {
      axios
        .post('/api/orders/updateStatus', {
          id: selectedOrder.id,
          status: newsStatus,
        })
        .then((response) => {
          console.log(response.data);
          setOpenDetail(false);
          reloadOrders();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const reloadOrders = async () => {
    console.log(`/api/admin/orders?page=${page}&size=${rowsPerPage}`);
    axios.get(`/api/admin/orders?page=${page}&size=${rowsPerPage}`).then((response) => {
      setOrders(response.data.data);
      setSelectedOrder(response.data.data[0]);
      console.log(response);
    });
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage) : 0;

  const filteredUsers = applySortFilter(orders, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Đơn đặt hàng
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {TABLE_HEAD.map((headCell) => (
                      <TableCell
                        key={headCell.id}
                        align={headCell.alignRight ? 'right' : 'left'}
                        sortDirection={orderBy === headCell.id ? order : false}
                      >
                        {headCell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((row) => {
                    const { id, username, shippingFee, amount, firstName, lastName } = row;
                    const statusColor = getStatusColor(row.status);
                    return (
                      <TableRow hover key={id} tabIndex={-1}>
                        <TableCell align="left">{row.id}</TableCell>
                        <TableCell align="left">{row.owner.username}</TableCell>
                        <TableCell align="left">{formatCurrency(amount)}</TableCell>
                        <TableCell align="left">{formatCurrency(shippingFee)}</TableCell>
                        <TableCell align="left">{row.shippingAddress.address}</TableCell>
                        <TableCell align="left">{row.shippingAddress.phoneNumber}</TableCell>
                        <TableCell align="left">
                          <Label color={statusColor}>{row.status}</Label>
                        </TableCell>
                        <TableCell align="left" onClick={(event) => handleDetailOrder(event, row)}>
                          <Label color="info">Chi tiết</Label>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            count={totalOrder}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {orders.length > 0 && selectedOrder != null && (
        <Dialog open={openDetail} onClose={handleCloseDetail} fullWidth="true">
          <DialogTitle>Thông tin đơn hàng</DialogTitle>
          <Stack padding={2} spacing={2}>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Thông tin người đặt hàng
              </Typography>
              <Stack alignItems={'center'} direction={'row'} spacing={2}>
                <img
                  src={formatImageUrl(selectedOrder.owner.avatar)}
                  alt="avatar"
                  loading="lazy"
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 50,
                  }}
                />
                <Typography variant="h6">{selectedOrder.owner.username}</Typography>
              </Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Sản phẩm
              </Typography>
              <Stack>
                {selectedOrder.items.map((item) => {
                  const product = item.product;
                  return (
                    <Stack direction={'row'} spacing={2}>
                      <Stack>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography>{`${item.quantity}x ${formatCurrency(product.price)}/${product.sku}`}</Typography>
                      </Stack>
                      <img
                        src={formatImageUrl(product.images[0])}
                        alt="avatar"
                        loading="lazy"
                        style={{
                          height: 80,
                          width: 100,
                        }}
                      />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Phí vận chuyển
              </Typography>
              <Stack>{formatCurrency(selectedOrder.shippingFee)}</Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Tổng đơn hàng
              </Typography>
              <Stack>{formatCurrency(selectedOrder.amount)}</Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Phương thức thanh toán
              </Typography>
              <Stack>{selectedOrder.paymentType.name}</Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Địa chỉ nhận hàng
              </Typography>
              <Stack>{selectedOrder.shippingAddress.address}</Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Thông tin người nhận
              </Typography>
              <Stack>{selectedOrder.shippingAddress.name}</Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Số điện thoại người nhận
              </Typography>
              <Stack>{selectedOrder.shippingAddress.phoneNumber}</Stack>
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography variant="body1" width={200}>
                Trạng thái
              </Typography>
              <Select
                width={200}
                value={newsStatus}
                onChange={(event) => {
                  setNewsStatus(event.target.value);
                }}
              >
                <MenuItem value={'IDLE'}>IDLE</MenuItem>
                <MenuItem value={'CONFIRMED'}>CONFIRMED</MenuItem>
                <MenuItem value={'DELIVERED'}>DELIVERED</MenuItem>
                <MenuItem value={'CANCELLED'}>CANCELLED</MenuItem>
              </Select>
            </Stack>
          </Stack>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleCloseDetail}>
              Hủy
            </Button>
            <Button variant="contained" color="info" onClick={updateStatus}>
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'IDLE':
      return 'info';
    case 'CONFIRMED':
      return 'secondary';
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
}
