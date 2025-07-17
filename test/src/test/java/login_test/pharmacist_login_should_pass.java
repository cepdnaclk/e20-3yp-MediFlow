package login_test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class pharmacist_login_should_pass {

    WebDriver driver;

    @BeforeClass
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("https://mediflow.live/");
    }

    @AfterClass
    public void tearDown() {
//        driver.quit();
    }

    @Test
    public void test_login_into_application() throws InterruptedException {
        Thread.sleep(2000);
        driver.findElement(By.id("email")).sendKeys("pharmacist@example.com");
        driver.findElement(By.id("password")).sendKeys("password123");

        driver.findElement(By.id("submit")).click();
        Thread.sleep(2000);
        String actualText = driver.findElement(By.id("role-indicator")).getText();
        String expectedText = "Pharmacist";

        Assert.assertEquals(actualText, expectedText);
    }
}