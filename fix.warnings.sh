
set -e

echo "🔍 Iniciando corrección automática de errores de formato..."

echo "💅 Aplicando formato con Prettier..."
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"

echo "🧹 Aplicando correcciones de ESLint..."
npm run lint

echo "✅ Corrección completa! Todos los errores de formato y linting han sido corregidos."