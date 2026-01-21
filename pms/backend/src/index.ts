import 'dotenv/config';

import app from './app';
import { validateEnvVar } from './utils/validation.util';

validateEnvVar();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
