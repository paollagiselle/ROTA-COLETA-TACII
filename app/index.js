import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import PlanejarRotaScreen from '../src/PlanejarRotaScreen'; 
import OfertasScreen from '../src/OfertasScreen'; 
import ExtratoScreen from '../src/ExtratoScreen'; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Componente que define a navegação por Abas (Tabs)
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? color : 'gray';

          if (route.name === 'Ofertas') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Planejar Rota') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Extrato') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveTintColor: '#0097e6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
        headerShown: false, 
      })}
    >
      <Tab.Screen 
        name="Ofertas" 
        component={OfertasScreen}
        options={{ title: 'Ofertas' }} 
      />
      <Tab.Screen 
        name="Planejar Rota" 
        component={PlanejarRotaScreen} 
        options={{ title: 'Rota' }} 
      />
      <Tab.Screen 
        name="Extrato" 
        component={ExtratoScreen}
        options={{ title: 'Extrato' }} 
      />
    </Tab.Navigator>
  );
}

// Componente principal que define a navegação por Pilha (Stack)
export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={HomeTabs} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}