import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.zd.school.wisdomclass.ecc.service.EccClassstarService;

import javax.annotation.Resource;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({ "classpath:spring.xml" })
public class test {
    @Resource
    private EccClassstarService eccClassstarService;

    @Test
    public void doAddTest() throws  Exception{
/*        EccClassstar entity = new EccClassstar();
        entity.setBeginDate(new Date());
        entity.setClaiId("fdsfds");
        entity.setClassName("test");
        entity.setDoDate(new Date());
        entity.setEndDate(new Date());
        entity.setStarLevel("1");

        eccClassstarService.merge(entity);*/
    }
}
