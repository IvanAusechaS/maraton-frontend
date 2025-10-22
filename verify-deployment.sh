#!/bin/bash

# Script to verify Vercel deployment configuration

echo "======================================"
echo "Vercel Deployment Verification"
echo "======================================"
echo ""

echo "1. Checking environment variables..."
echo ""
echo "   Required in Vercel:"
echo "   VITE_API_URL=https://maraton-backend.onrender.com/api"
echo ""

echo "2. To set this in Vercel:"
echo "   vercel env add VITE_API_URL"
echo "   (Enter: https://maraton-backend.onrender.com/api)"
echo ""

echo "3. Backend CORS must allow your Vercel domain"
echo "   Your Vercel URL: https://[your-app].vercel.app"
echo ""

echo "4. Backend must set cookies with:"
echo "   - sameSite: 'none'"
echo "   - secure: true"
echo "   - httpOnly: true"
echo ""

echo "5. After setting env vars, redeploy:"
echo "   vercel --prod"
echo ""

echo "======================================"
echo "Common Issues:"
echo "======================================"
echo ""
echo "❌ 401 Unauthorized = Missing/expired JWT cookie"
echo "❌ CORS error = Backend not allowing your domain"
echo "❌ Network error = Wrong API_URL or backend down"
echo ""

echo "To test if backend is accessible:"
echo "curl https://maraton-backend.onrender.com/api/peliculas"
echo ""
