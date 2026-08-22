import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import type { CartItem } from '@arli/contracts';
import { type CartTotals, lineTotal } from '@arli/core';
import type { CustomerDictionary } from '@arli/i18n';
import { theme as Theme } from '@arli/tokens';
import { api } from '../api';

interface CheckoutProps {
  cartItems: CartItem[];
  /** Shared with Cart, so the two can never disagree on the discounted total —
   *  which is the bug this screen exists to fix in the first place. */
  totals: CartTotals;
  t: CustomerDictionary;
  onClearCart: () => void;
  onNavigate: (screen: string) => void;
  onAddPoints: (pts: number) => void;
}

/**
 * Real checkout for mobile-customer.
 *
 * Previously this screen did not exist: the cart's "proceed" button cleared
 * the cart, added 10 points and showed a success alert WITHOUT ever calling
 * the API — so no order was created and no merchant ever saw it. This posts a
 * real POST /api/orders and only shows success once the server confirms it.
 */
export const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  totals,
  t,
  onClearCart,
  onNavigate,
  onAddPoints,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [orderId, setOrderId] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [placing, setPlacing] = useState(false);

  const { subtotal, discount, total, points: pts } = totals;

  const handlePlaceOrder = () => {
    // Guards against a double-tap creating two orders on a slow connection —
    // the same class of bug found in the merchant listing form this session.
    if (placing) return;
    if (!name.trim() || !address.trim() || !pincode.trim()) {
      Alert.alert(t.enterDetails);
      return;
    }
    setPlacing(true);

    const summary = cartItems.map((c) => `${c.name} (x${c.qty})`).join(', ');

    api.orders
      .create({
        cust: { en: name, hi: name },
        item: { en: summary, hi: summary },
        qty: cartItems.reduce((sum, c) => sum + c.qty, 0),
        // The discounted total — the whole reason Cart and Checkout share
        // one cartTotals() result rather than each computing their own.
        amt: total,
        meas: cartItems.some((c) => c.hasMeas),
        status: 0,
      })
      .then((order) => {
        // The id the SERVER actually stored, not a client-generated guess —
        // showing anything else means the order number a customer quotes
        // does not exist in the database.
        setOrderId(order.id);
        setEarnedPoints(pts);
        onAddPoints(pts);
        setStep('success');
        onClearCart();
      })
      .catch(() => Alert.alert('Error sending order. Please try again.'))
      .finally(() => setPlacing(false));
  };

  const statusSteps = [
    { mark: '1', label: t.stPlaced, done: true },
    { mark: '2', label: t.stAccepted, done: false },
    { mark: '3', label: t.stProgress, done: false },
    { mark: '4', label: t.stReady, done: false },
    { mark: '5', label: t.stDelivered, done: false },
  ];

  if (step === 'success') {
    return (
      <ScrollView contentContainerStyle={styles.successContainer}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
        <Text style={styles.successTitle}>{t.orderPlaced}</Text>
        <Text style={styles.orderIdText}>
          {t.orderId}: <Text style={styles.orderIdValue}>{orderId}</Text>
        </Text>
        <Text style={styles.pointsText}>★ +{earnedPoints} {t.loyaltyPts}</Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>{t.statusTitle}</Text>
          <View style={styles.statusRow}>
            {statusSteps.map((ss, i) => (
              <React.Fragment key={ss.mark}>
                <View style={styles.statusStep}>
                  <View style={[styles.statusDot, ss.done && styles.statusDotDone]}>
                    <Text style={[styles.statusDotText, ss.done && styles.statusDotTextDone]}>
                      {ss.mark}
                    </Text>
                  </View>
                  <Text
                    style={[styles.statusLabel, ss.done && styles.statusLabelDone]}
                    numberOfLines={2}
                  >
                    {ss.label}
                  </Text>
                </View>
                {i < statusSteps.length - 1 && (
                  <View style={[styles.statusLine, ss.done && styles.statusLineDone]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.successActions}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => onNavigate('chat')}>
            <Text style={styles.secondaryBtnText}>💬 {t.chatWithShop}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => onNavigate('explore')}>
            <Text style={styles.primaryBtnText}>{t.continueShopping}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>{t.checkoutTitle}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 {t.deliveryAddr}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t.fullName}
            placeholderTextColor={Theme.colorPlaceholder}
            style={styles.input}
          />
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder={t.addressPh}
            placeholderTextColor={Theme.colorPlaceholder}
            multiline
            numberOfLines={2}
            style={[styles.input, styles.textarea]}
          />
          <TextInput
            value={pincode}
            onChangeText={(v) => setPincode(v.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder={t.pincodePh}
            placeholderTextColor={Theme.colorPlaceholder}
            keyboardType="number-pad"
            style={[styles.input, styles.pincodeInput]}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>💳 {t.payment}</Text>
          <View style={[styles.payOption, styles.payOptionActive]}>
            <View style={styles.radioOuter}>
              <View style={styles.radioInner} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.payOptionTitle}>🏪 {t.payAtShopOpt}</Text>
              <Text style={styles.payOptionSub}>{t.payAtShopSub}</Text>
            </View>
          </View>
          <View style={[styles.payOption, styles.payOptionDisabled]}>
            <View style={styles.radioOuter} />
            <View style={{ flex: 1 }}>
              <Text style={styles.payOptionTitle}>UPI / Razorpay</Text>
              <Text style={styles.payOptionSub}>{t.comingSoon}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t.orderSummary}</Text>
          {cartItems.map((ci) => (
            <View key={ci.id} style={styles.summaryRow}>
              <Text style={styles.summaryLabel} numberOfLines={1}>
                {ci.name} × {ci.qty}
              </Text>
              <Text style={styles.summaryValue}>₹{lineTotal(ci)}</Text>
            </View>
          ))}
          {discount > 0 && (
            <>
              <View style={[styles.summaryRow, styles.summaryDivider]}>
                <Text style={styles.summaryLabel}>{t.subtotal}</Text>
                <Text style={styles.summaryValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.discountLabel}>{t.discount} ({totals.appliedCode})</Text>
                <Text style={styles.discountValue}>−₹{discount}</Text>
              </View>
            </>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t.total}</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomTotalLabel}>{t.total}</Text>
          <Text style={styles.bottomTotalValue}>₹{total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeOrderBtn, placing && styles.placeOrderBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={placing}
        >
          {placing
            ? <ActivityIndicator color={Theme.colorCream} />
            : <Text style={styles.placeOrderBtnText}>{t.placeOrder} →</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  scroll: { padding: 16, paddingBottom: 24, gap: 14 },
  pageTitle: { fontSize: 26, fontFamily: Theme.fontSerif, color: Theme.textPrimary, marginBottom: 4 },
  card: {
    backgroundColor: Theme.colorCardBg, borderWidth: 1, borderColor: Theme.borderColor,
    borderRadius: 16, padding: 16, gap: 10,
  },
  cardTitle: { fontSize: 15, fontFamily: Theme.fontSansBold, color: Theme.textPrimary, marginBottom: 2 },
  input: {
    borderWidth: 1.5, borderColor: Theme.borderColor, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Theme.textPrimary, minHeight: 46,
  },
  textarea: { textAlignVertical: 'top', minHeight: 64 },
  pincodeInput: { width: 140 },
  payOption: {
    flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5,
    borderRadius: 12, padding: 12, minHeight: 44,
  },
  payOptionActive: { borderColor: Theme.colorPrimary },
  payOptionDisabled: { borderColor: Theme.borderColor, opacity: 0.55 },
  payOptionTitle: { fontSize: 14, fontFamily: Theme.fontSansBold, color: Theme.textPrimary },
  payOptionSub: { fontSize: 12, color: Theme.textMuted, marginTop: 2 },
  radioOuter: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: Theme.colorPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  radioInner: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: Theme.colorPrimary },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryDivider: { borderTopWidth: 1, borderTopColor: Theme.borderColor, marginTop: 6, paddingTop: 8 },
  summaryLabel: { fontSize: 13.5, color: Theme.textSecondary, flex: 1, marginRight: 8 },
  summaryValue: { fontSize: 13.5, fontFamily: Theme.fontSansSemiBold, color: Theme.textPrimary },
  discountLabel: { fontSize: 13.5, color: Theme.colorSuccess },
  discountValue: { fontSize: 13.5, fontFamily: Theme.fontSansBold, color: Theme.colorSuccess },
  totalRow: { borderTopWidth: 1, borderTopColor: Theme.borderColor, marginTop: 8, paddingTop: 10 },
  totalLabel: { fontSize: 16, fontFamily: Theme.fontSansBold, color: Theme.textPrimary },
  totalValue: { fontSize: 18, fontFamily: Theme.fontSansBold, color: Theme.colorPrimary },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
    padding: 14, backgroundColor: Theme.colorCardBg, borderTopWidth: 1, borderTopColor: Theme.borderColor,
  },
  bottomTotalLabel: { fontSize: 12, color: Theme.textMuted, fontFamily: Theme.fontSansSemiBold },
  bottomTotalValue: { fontSize: 18, fontFamily: Theme.fontSansBold, color: Theme.colorPrimary },
  placeOrderBtn: {
    backgroundColor: Theme.colorAccent, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 26,
    minHeight: 50, alignItems: 'center', justifyContent: 'center',
  },
  placeOrderBtnDisabled: { opacity: 0.75 },
  placeOrderBtnText: { color: '#fff', fontSize: 15, fontFamily: Theme.fontSansBold },

  successContainer: { flexGrow: 1, alignItems: 'center', padding: 24, paddingTop: 40, backgroundColor: Theme.bgPrimary },
  checkCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Theme.colorSuccess,
    alignItems: 'center', justifyContent: 'center', marginBottom: 18,
  },
  checkMark: { color: '#fff', fontSize: 32, fontFamily: Theme.fontSansBold },
  successTitle: { fontSize: 26, fontFamily: Theme.fontSerif, color: Theme.textPrimary, textAlign: 'center' },
  orderIdText: { fontSize: 14, color: Theme.textMuted, marginTop: 8 },
  orderIdValue: { color: Theme.textPrimary, fontFamily: Theme.fontSansBold },
  pointsText: { fontSize: 14, color: Theme.colorWarningText, fontFamily: Theme.fontSansBold, marginTop: 4, marginBottom: 20 },
  statusCard: {
    width: '100%', backgroundColor: Theme.colorCardBg, borderWidth: 1, borderColor: Theme.borderColor,
    borderRadius: 16, padding: 18, marginBottom: 20,
  },
  statusTitle: { fontSize: 14, fontFamily: Theme.fontSansBold, color: Theme.textPrimary, marginBottom: 14 },
  statusRow: { flexDirection: 'row', alignItems: 'flex-start' },
  statusStep: { alignItems: 'center', width: 44, gap: 5 },
  statusLine: { flex: 1, height: 2, backgroundColor: Theme.borderColor, marginTop: 13 },
  statusLineDone: { backgroundColor: Theme.colorPrimary },
  statusDot: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: Theme.borderColor,
    backgroundColor: Theme.colorCardBg, alignItems: 'center', justifyContent: 'center',
  },
  statusDotDone: { backgroundColor: Theme.colorPrimary, borderColor: Theme.colorPrimary },
  statusDotText: { fontSize: 11, fontFamily: Theme.fontSansBold, color: Theme.textMuted },
  statusDotTextDone: { color: '#fff' },
  statusLabel: { fontSize: 9.5, fontFamily: Theme.fontSansSemiBold, color: Theme.textMuted, textAlign: 'center' },
  statusLabelDone: { color: Theme.textPrimary },
  successActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  secondaryBtn: {
    borderWidth: 1.5, borderColor: Theme.colorPrimary, borderRadius: 12, paddingVertical: 13,
    paddingHorizontal: 18, minHeight: 46, alignItems: 'center', justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 13.5, fontFamily: Theme.fontSansBold, color: Theme.colorPrimary },
  primaryBtn: {
    backgroundColor: Theme.colorPrimary, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 22,
    minHeight: 46, alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 13.5, fontFamily: Theme.fontSansBold, color: Theme.colorCream },
});
