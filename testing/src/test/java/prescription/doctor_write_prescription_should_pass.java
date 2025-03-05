package prescription;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.time.Duration;

public class doctor_write_prescription_should_pass {

    WebDriver driver;

    @BeforeClass
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("http://localhost:5173/");
    }

    @AfterClass
    public void tearDown() {
//        driver.quit();
    }

    @Test
    public void test_login_into_application() throws InterruptedException {
        Thread.sleep(2000);
        driver.findElement(By.id("email")).sendKeys("doctor@example.com");
        driver.findElement(By.id("password")).sendKeys("password123");

        driver.findElement(By.id("submit")).click();
        Thread.sleep(2000);
        WebElement scanPatients = driver.findElement(By.cssSelector("[data-testid='menu-item-scan_patients']"));
        scanPatients.click();
        driver.findElement(By.id("start-scan")).click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("proceed")));
        Thread.sleep(2000);
        driver.findElement(By.id("proceed")).click();
        Thread.sleep(2000);
        driver.findElement(By.id("submit")).click();
    }
}
