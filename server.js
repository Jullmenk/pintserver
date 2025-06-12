require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const quizRoutes = require('./routes/quizRoutes');
const forumRoutes = require('./routes/forumRoutes');
const ocorrenciasRoutes = require('./routes/ocorrenciasRoutes');
const { swaggerUi, specs } = require('./swagger');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/ocorrencias', ocorrenciasRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'PINT Server is running!' });
});

// Sync database
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(new Date())
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
