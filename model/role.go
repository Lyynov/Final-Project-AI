package model

import "gorm.io/gorm"

type Role struct {
	gorm.Model
	Name  string `gorm:"type:varchar(255);not null;unique" json:"name"`
	Users []User `gorm:"many2many:user_roles;" json:"users"`
}
