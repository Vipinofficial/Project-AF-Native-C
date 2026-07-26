import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';

interface MobileBottomNavProps {
  currentScreen: string;
  cartCount: number;
  loggedIn: boolean;
  onNavigate: (screen: string) => void;
  t: any;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  cartCount,
  loggedIn,
  onNavigate,
  t,
}) => {
  const tabs = [
    {
      id: 'home',
      label: t.tabHome || 'Home',
      icon: (active: boolean) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#2A3B66' : 'none'} stroke={active ? '#2A3B66' : '#8A8270'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V9.5z" />
        </Svg>
      ),
    },
    {
      id: 'explore',
      label: t.navExplore || 'Explore',
      icon: (active: boolean) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#2A3B66' : '#8A8270'} strokeWidth={active ? '2.3' : '1.8'} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="11" cy="11" r="8" />
          <Line x1="21" y1="21" x2="16.65" y2="16.65" />
        </Svg>
      ),
    },
    {
      id: 'cart',
      label: t.navCart || 'Cart',
      badge: cartCount,
      icon: (active: boolean) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#C2492F' : 'none'} stroke={active ? '#C2492F' : '#8A8270'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <Line x1="3" y1="6" x2="21" y2="6" />
          <Path d="M16 10a4 4 0 0 1-8 0" />
        </Svg>
      ),
    },
    {
      id: 'chat',
      label: t.navChat || 'Chat',
      icon: (active: boolean) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#2A3B66' : 'none'} stroke={active ? '#2A3B66' : '#8A8270'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </Svg>
      ),
    },
    {
      id: loggedIn ? 'home' : 'login',
      label: loggedIn ? 'Account' : (t.navLogin || 'Login'),
      icon: (active: boolean) => (
        <Svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#2A3B66' : 'none'} stroke={active ? '#2A3B66' : '#8A8270'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <Circle cx="12" cy="7" r="4" />
        </Svg>
      ),
    },
  ];

  return (
    <View style={styles.floatingNavContainer}>
      <View style={styles.floatingNavPill}>
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => onNavigate(tab.id)}
              style={styles.navButton}
            >
              <View style={styles.iconWrapper}>
                {tab.icon(isActive)}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingNavContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 999,
  },
  floatingNavPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 480,
    height: 60,
    backgroundColor: 'rgba(250, 245, 236, 0.95)',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(228, 219, 200, 0.9)',
    paddingHorizontal: 8,
    shadowColor: '#22201C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 10,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#C2492F',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontFamily: 'InstrumentSans_700Bold',
  },
  navLabel: {
    fontSize: 9.5,
    fontFamily: 'InstrumentSans_600SemiBold',
    color: '#8A8270',
    marginTop: 2,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  navLabelActive: {
    color: '#2A3B66',
    fontFamily: 'InstrumentSans_700Bold',
  },
});
