import 'package:flutter/material.dart';

class AppTheme {
  static const primaryColor = Color(0xFF1A1A2E);
  static const accentColor = Color(0xFF00DBDE);
  static const secondaryColor = Color(0xFFFC00FF);

  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.light(
      primary: primaryColor,
      secondary: accentColor,
      tertiary: secondaryColor,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: primaryColor,
      foregroundColor: Colors.white,
    ),
    fontFamily: 'Roboto',
  );

  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.dark(
      primary: primaryColor,
      secondary: accentColor,
      tertiary: secondaryColor,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.black,
      foregroundColor: Colors.white,
    ),
    fontFamily: 'Roboto',
  );
}
