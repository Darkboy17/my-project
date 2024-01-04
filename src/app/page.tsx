"use client";
import TableComponent from './components/TableComponent';
import { mockProducts } from './mockData';

const Home = () => {
  return (
    <TableComponent products={mockProducts} />
  );
};

export default Home;