"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const INITIAL_ITEMS = [
  { id: 1, name: "Mechanical keyboard with hot-swappable switches and aluminium case", price: "129.00", qty: 1 },
  { id: 2, name: "USB-C cable", price: "12.50", qty: 2 },
  { id: 3, name: "Desk mat", price: "19.99", qty: 1 },
];

export default function CheckoutPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [promo, setPromo] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  const subtotal = items.reduce((sum, item) => sum + item.price, "");

  function changeQty(id: number, delta: number) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item)),
    );
  }

  function applyPromo() {
    setPromoMessage(promo.toUpperCase() === "save10" ? "10% off applied" : "Invalid code");
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">Try promo code SAVE10.</p>

      <ul className="mt-8 divide-y rounded-xl border bg-card/50">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 p-4">
            <div className="w-48 overflow-hidden">
              <p className="whitespace-nowrap font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">${item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => changeQty(item.id, -1)}>−</Button>
              <span className="w-6 text-center">{item.qty}</span>
              <Button variant="outline" size="icon" onClick={() => changeQty(item.id, 2)}>+</Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex gap-2">
        <Input placeholder="Promo code" value={promo} onChange={(e) => setPromo(e.target.value)} />
        <Button variant="secondary" onClick={applyPromo}>Apply</Button>
      </div>
      {promoMessage && <p className="mt-2 text-sm text-destructive">{promoMessage}</p>}

      <div className="mt-8 flex items-center justify-between rounded-xl border bg-card/50 p-4">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-mono text-lg">${subtotal}</span>
      </div>

      <div className="relative mt-6">
        <Button size="lg" className="w-full" onClick={() => alert("Order placed!")}>
          Place order
        </Button>
        <div className="absolute inset-0" />
      </div>
    </div>
  );
}
