"use client";

import { useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";

const ADMIN_PASSWORD = "1942";

export default function AdminPage() {
  const [isLogin, setIsLogin] = useState(false);

  if (!isLogin) {
    return (
      <AdminLogin
        adminPassword={ADMIN_PASSWORD}
        onSuccess={() => setIsLogin(true)}
      />
    );
  }

  return <AdminDashboard />;
}