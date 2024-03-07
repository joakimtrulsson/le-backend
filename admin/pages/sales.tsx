import { useEffect, useState } from 'react';
import { PageContainer } from '@keystone-6/core/admin-ui/components';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { theme } from '../components/theme';
import { Order, OrderDetail, ProductSales, DailySales } from '../types/salesTypes';

export default function Sales() {
  const [data, setData] = useState<Order[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL ||
          'https://le-backend-stg-33dad4741ce3.herokuapp.com/api/graphql',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
            query Orders($orderBy: [OrderOrderByInput!]!) {
              orders(orderBy: $orderBy) {
                amount
                orderDetails
                createdAt
                customerName
                customerEmail
                id
              }
            }
          `,
            variables: {
              orderBy: [{ createdAt: 'desc' }],
            },
          }),
        }
      );
      const jsonData = await response.json();
      setData(jsonData.data.orders);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateTotalSales = () => {
    return data.reduce((total, sale) => total + sale.amount, 0);
  };

  const findTopThreeProducts = () => {
    const productMap: ProductSales = {};
    data.forEach((sale) => {
      sale.orderDetails.forEach((detail) => {
        const productName = detail.description;
        productMap[productName] = (productMap[productName] || 0) + detail.amount_total;
      });
    });
    const sortedProducts = Object.entries(productMap).sort((a, b) => b[1] - a[1]);
    return sortedProducts.slice(0, 3);
  };

  const calculateDailySales = () => {
    const dailySales: DailySales = {};
    data.forEach((sale) => {
      const date = sale.createdAt.split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + sale.amount;
    });
    return dailySales;
  };

  const calculateNumberOfProductsSold = () => {
    let totalProductsSold = 0;
    data.forEach((order) => {
      order.orderDetails.forEach((detail: OrderDetail) => {
        totalProductsSold += detail.quantity;
      });
    });
    return totalProductsSold;
  };

  const calculateOrdersToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const ordersToday = data.filter((order) => order.createdAt.split('T')[0] === today);

    return ordersToday.length;
  };

  const findTopCustomer = () => {
    if (data.length === 0) {
      return null;
    }

    const customerMap: Record<string, number> = {};
    data.forEach((order) => {
      const customerName = order.customerName;
      customerMap[customerName] = (customerMap[customerName] || 0) + 1;
    });

    let topCustomer = null;
    let maxOrders = 0;

    Object.entries(customerMap).forEach(([customerName, orderCount]) => {
      if (orderCount > maxOrders) {
        topCustomer = customerName;
        maxOrders = orderCount;
      }
    });

    return topCustomer;
  };

  const customerWithMostPurchases = findTopCustomer();
  const numberOfProductsSold = calculateNumberOfProductsSold();
  const totalSales = calculateTotalSales();
  const topThreeProducts = findTopThreeProducts();
  const dailySales = calculateDailySales();
  const ordersToday = calculateOrdersToday();

  return (
    <PageContainer header='Sales'>
      <ThemeProvider theme={theme}>
        <Container maxWidth={false} sx={{ mt: 3 }}>
          <Stack>
            <Card sx={{ backgroundColor: '#036b9c' }}>
              <Typography component='p' variant='subtitle2'>
                {totalSales.toLocaleString('sv-SE')} kr
              </Typography>
              <Typography variant='subtitle1'>Total Sales</Typography>
            </Card>

            <Card sx={{ backgroundColor: '#036b9c' }}>
              <Typography variant='subtitle2'>{data.length}</Typography>
              <Typography variant='subtitle1'>Number of Orders</Typography>
            </Card>

            <Card sx={{ backgroundColor: '#036b9c' }}>
              <Typography variant='subtitle2' gutterBottom>
                {(totalSales / data.length).toFixed(2).toLocaleString()} kr
              </Typography>
              <Typography variant='subtitle1'>Average Order Size</Typography>
            </Card>

            <Card sx={{ backgroundColor: '#036b9c' }}>
              <Typography variant='subtitle2'>{numberOfProductsSold}</Typography>
              <Typography variant='subtitle1'>Number of Products Sold</Typography>
            </Card>

            <Card sx={{ backgroundColor: '#036b9c' }}>
              <Typography variant='subtitle2'>{ordersToday}</Typography>
              <Typography variant='subtitle1'>Orders today</Typography>
            </Card>

            <Card sx={{ backgroundColor: '#036b9c' }}>
              <Typography variant='subtitle2'>{customerWithMostPurchases}</Typography>
              <Typography variant='subtitle1'>Top Customer</Typography>
            </Card>
          </Stack>

          <Typography variant='h1' component='h1' gutterBottom>
            Top 3 Products
          </Typography>
          <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align='right'>Total Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topThreeProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell component='th' scope='row'>
                      {product[0]}
                    </TableCell>
                    <TableCell align='right'>
                      {(product[1] / 100).toLocaleString('sv-SE')} kr
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant='h1' component='h1' gutterBottom>
            Daily Sales
          </Typography>
          <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(dailySales).map(([date, amount], index) => (
                  <TableRow key={index}>
                    <TableCell component='th' scope='row'>
                      {date}
                    </TableCell>
                    <TableCell align='right'>
                      {amount.toLocaleString('sv-SE')} kr
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant='h1' component='h1' gutterBottom>
            Latest Orders
          </Typography>
          <TableContainer component={Paper} style={{ marginBottom: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Customer Email</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(0, 10).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.customerEmail}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString('sv-SE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell align='right'>
                      {order.amount.toLocaleString('sv-SE')} kr
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </ThemeProvider>
    </PageContainer>
  );
}
