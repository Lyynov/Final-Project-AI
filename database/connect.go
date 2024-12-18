package database

import (
	"a21hc3NpZ25tZW50/config"
	"a21hc3NpZ25tZW50/helper"
	"a21hc3NpZ25tZW50/model"
	"fmt"
	"strconv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// ConnectDB connect to db
func ConnectDB() {
	var err error
	p := config.Config("DB_PORT")
	port, err := strconv.ParseUint(p, 10, 32)
	if err != nil {
		panic("failed to parse database port")
	}

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", config.Config("DB_HOST"), port, config.Config("DB_USER"), config.Config("DB_PASSWORD"), config.Config("DB_NAME"))
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	fmt.Println("Connection Opened to Database")
	err = AutoMigrateAndSeed(DB)
	if err != nil {
		return
	}
	fmt.Println("Database Migrated")
}

// AutoMigrateAndSeed AutoMigrate and Seed
func AutoMigrateAndSeed(db *gorm.DB) error {
	// AutoMigrate Role model
	if err := db.AutoMigrate(&model.User{}, &model.Role{}); err != nil {
		return err
	}

	// Seed roles
	roles := []string{"SUPERADMIN", "ADMIN", "USER"}
	for _, roleName := range roles {
		// Use FirstOrCreate to ensure no duplicate records
		var role model.Role
		db.FirstOrCreate(&role, model.Role{Name: roleName})
	}

	// Retrieve roles
	var superAdminRole, adminRole, userRole model.Role
	db.First(&superAdminRole, "name = ?", "SUPERADMIN")
	db.First(&adminRole, "name = ?", "ADMIN")
	db.First(&userRole, "name = ?", "USER")

	// Create hash passwords
	hashSuperadmin, err := helper.HashPassword("super$2024")
	if err != nil {
		return err
	}

	hashAdmin, err := helper.HashPassword("admin$2024")
	if err != nil {
		return err
	}

	hashUser, err := helper.HashPassword("user$2024")
	if err != nil {
		return err
	}

	// Create users and assign roles
	users := []model.User{
		{
			Username: "superadmin",
			Email:    "superadmin@example.com",
			Password: hashSuperadmin,
			Names:    "SuperAdmin",
			Roles:    []model.Role{superAdminRole, adminRole},
		},
		{
			Username: "admin",
			Email:    "admin@example.com",
			Password: hashAdmin,
			Names:    "Admin",
			Roles:    []model.Role{adminRole},
		},
		{
			Username: "user",
			Email:    "user@example.com",
			Password: hashUser,
			Names:    "User",
			Roles:    []model.Role{userRole},
		},
	}

	for _, userData := range users {
		var user model.User
		// Create user
		db.FirstOrCreate(&user, model.User{
			Username: userData.Username,
			Email:    userData.Email,
			Password: userData.Password,
			Names:    userData.Names,
		})
		// Associate roles
		err := db.Model(&user).Association("Roles").Replace(userData.Roles)
		if err != nil {
			return err
		}
	}

	return nil
}
