package com.acadprobot.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class AcadProBotAdminServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AcadProBotAdminServiceApplication.class, args);
	}

}
