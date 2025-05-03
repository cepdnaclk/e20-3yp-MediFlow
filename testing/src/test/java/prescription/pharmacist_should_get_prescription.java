package prescription;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.devtools.DevTools;
import org.openqa.selenium.devtools.v119.network.Network;
import org.openqa.selenium.devtools.v119.network.model.Response;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

public class pharmacist_should_get_prescription {

    @Test
    public void test_prescription() throws InterruptedException {
        // Set up ChromeDriver with DevTools
        ChromeOptions options = new ChromeOptions();
        ChromeDriver driver = new ChromeDriver(options);
        driver.manage().window().maximize();

        // Start DevTools session
        DevTools devTools = driver.getDevTools();
        devTools.createSession();

        AtomicReference<String> actual_id = new AtomicReference<>();
        // Enable network interception
        devTools.send(Network.enable(Optional.empty(), Optional.empty(), Optional.empty()));

        // Add listener for network responses
        devTools.addListener(Network.responseReceived(), responseReceived -> {
            Response response = responseReceived.getResponse();

            if (response.getUrl().contains("http://localhost:5000/api/prescriptions")) { // Filter by your API endpoint
                try {
                    // Use Network.getResponseBody to get the response body after response is fully received
                    Thread.sleep(500); // Add a small delay to ensure the response body is available

                    var responseBody = devTools.send(Network.getResponseBody(responseReceived.getRequestId()));
                    if (responseBody != null) {
                        try {
                            // Parse the JSON body
                            String body = responseBody.getBody();
                            ObjectMapper objectMapper = new ObjectMapper();
                            JsonNode jsonNode = objectMapper.readTree(body);

                            // Extract "id" from "prescription"
                            if (jsonNode.has("prescription") && jsonNode.get("prescription").has("id")) {
                                String prescriptionId = jsonNode.get("prescription").get("id").asText();
                                actual_id.set(prescriptionId);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    } else {
                        System.out.println("No body found for this response.");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        // Open the application
        driver.get("http://localhost:5173/"); // Change to your app URL

        // Perform login
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("email"))).sendKeys("doctor@example.com");
        driver.findElement(By.id("password")).sendKeys("password123");
        driver.findElement(By.id("submit")).click();

        // Wait for the page to load
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("[data-testid='menu-item-scan_patients']"))).click();
        driver.findElement(By.id("start-scan")).click();

        // Wait until the 'proceed' button is visible and click
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("proceed")));
        Thread.sleep(1000);
        driver.findElement(By.id("proceed")).click();

        // Click Submit button to trigger API request
        Thread.sleep(1000);
        WebElement submitButton = driver.findElement(By.id("submit"));
        submitButton.click();

        // Wait for response capture (optional, based on your needs)
        Thread.sleep(1000); // Ensure time for the response to be processed

        System.out.println("Actual ID: " + actual_id);
        driver.get("http://localhost:5173/");

        // Open the application
        driver.findElement(By.id("email")).sendKeys("pharmacist@example.com");
        driver.findElement(By.id("password")).sendKeys("password123");

        driver.findElement(By.id("submit")).click();
        Thread.sleep(2000);

        driver.findElement(By.cssSelector("[data-testid='menu-item-prescriptions']")).click();
        Thread.sleep(1000);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//tbody/tr[last()]/td[1]/div")));
        String expected_id = driver.findElement(By.xpath("//tbody/tr[last()]/td[1]/div")).getText();
        System.out.println("Expected ID: " + expected_id);

        Assert.assertEquals(actual_id.get(), expected_id);
    }
}
