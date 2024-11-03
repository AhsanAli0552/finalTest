import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Add from "./Add";
import Edit from "./Edit";
import ShowNote from "./Home/ShowNote";
export default function Frontend() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Add" element={<Add />} />
        <Route path="/Edit" element={<Edit />} />
        <Route path="/Note" element={<ShowNote />} />
        <Route path="*" element={<h1> Page Not Found </h1>} />
      </Routes>
      <Footer />
    </>
  );
}
