# Security Guidelines

## Environment Variables
- Never commit `.env` files to version control
- Use `.env.example` as template
- Generate secure random JWT secrets in production

## Backend Security
- All API endpoints use CORS with specific origins
- JWT tokens expire in 24 hours
- Passwords are hashed with bcrypt
- Input validation on all endpoints

## Frontend Security
- No dangerouslySetInnerHTML usage
- All user inputs are sanitized
- HTTPS required in production
- CSP headers recommended

## Smart Contract Security
- ReentrancyGuard on all state-changing functions
- Input validation on all parameters
- Access control with relayer pattern
- Comprehensive test coverage

## Deployment Checklist
- [ ] Set secure environment variables
- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Update package dependencies
- [ ] Run security audit: `npm audit`