package handler

import (
	"a21hc3NpZ25tZW50/config"
	"a21hc3NpZ25tZW50/database"
	"a21hc3NpZ25tZW50/model"
	"encoding/json"
	"errors"
	"net/http"
	"net/mail"
	"time"

	"gorm.io/gorm"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// CheckPasswordHash compare password with hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func getUserByEmail(e string) (*model.User, error) {
	db := database.DB
	var user model.User
	if err := db.Where(&model.User{Email: e}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func getUserByUsername(u string) (*model.User, error) {
	db := database.DB
	var user model.User
	if err := db.Where(&model.User{Username: u}).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func isEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

// LoginInput represents the input data for login.
type LoginInput struct {
	Identity string `json:"identity"`
	Password string `json:"password"`
}

// UserData represents the user's data structure.
type UserData struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login is the login handler.
func Login(w http.ResponseWriter, r *http.Request) {
	// Parse input from the request body
	var input LoginInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, `{"status":"error","message":"Invalid request"}`, http.StatusBadRequest)
		return
	}

	identity := input.Identity
	pass := input.Password

	// Simulate user retrieval logic (replace with your DB logic)
	userModel, err := new(model.User), *new(error)

	if isEmail(identity) {
		userModel, err = getUserByEmail(identity)
	} else {
		userModel, err = getUserByUsername(identity)
	}

	if err != nil || userModel == nil {
		http.Error(w, `{"status":"error","message":"Invalid identity or password"}`, http.StatusUnauthorized)
		return
	}

	// Verify password
	if !CheckPasswordHash(pass, userModel.Password) {
		http.Error(w, `{"status":"error","message":"Invalid identity or password"}`, http.StatusUnauthorized)
		return
	}

	// Create JWT token
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = userModel.Username
	claims["user_id"] = userModel.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(config.Config("SECRET")))
	if err != nil {
		http.Error(w, `{"status":"error","message":"Token generation failed"}`, http.StatusInternalServerError)
		return
	}

	// Send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Success login",
		"data":    t,
	})
}
