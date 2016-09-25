import java.io.File;
import robocode.BattleResults;
import robocode.control.BattleSpecification;
import robocode.control.BattlefieldSpecification;
import robocode.control.RobocodeEngine;
import robocode.control.RobotSpecification;
import robocode.control.events.BattleCompletedEvent;
import robocode.control.events.BattleErrorEvent;
import robocode.control.events.BattleFinishedEvent;
import robocode.control.events.BattleMessageEvent;
import robocode.control.events.BattlePausedEvent;
import robocode.control.events.BattleResumedEvent;
import robocode.control.events.BattleStartedEvent;
import robocode.control.events.IBattleListener;
import robocode.control.events.RoundEndedEvent;
import robocode.control.events.RoundStartedEvent;
import robocode.control.events.TurnEndedEvent;
import robocode.control.events.TurnStartedEvent;

public class TestRobocode implements IBattleListener {
	protected RobocodeEngine engine = null;
	protected int testBotScore = 0;
	protected int testBotRank = 0;

	public static void main(String args[]) {
		new TestRobocode(args[0], args[1], args[2], Integer.parseInt(args[3]));
	}

	public TestRobocode(String robocodePath, String testBotName,
	                    String enemyBotName, int nRounds) {
		engine = new RobocodeEngine(new File(robocodePath));
		engine.addBattleListener(this);

		// Disable UI
		engine.setVisible(false);

		// Find robots in the directory.
		RobotSpecification roboSpecs[] = engine.getLocalRepository();
		RobotSpecification testBot = findBot(testBotName, roboSpecs);
		RobotSpecification enemyBot = findBot(enemyBotName, roboSpecs);

		// Run battle
		runBattle(nRounds, testBot, enemyBot);
	}

	public void runBattle(int rounds, RobotSpecification r1, RobotSpecification r2) {
		RobotSpecification robots[] = new RobotSpecification[2];
		robots[0] = r1; robots[1] = r2;
		BattleSpecification battleSpec =
			new BattleSpecification(rounds, new BattlefieldSpecification(800,600), robots);
		engine.runBattle(battleSpec, true);
	}

	public void onBattleCompleted(BattleCompletedEvent event) {
		// Affichage des résultats de la bataille une fois tous les rounds complétés.
		BattleResults results[] = event.getIndexedResults();

		System.out.printf("\n\n== Battle results\n");
		for (int i = 0; i < results.length; ++i)
			System.out.printf("%s \t rank: %d score: %d\n",
			                  results[i].getTeamLeaderName(), results[i].getRank(), results[i].getScore());
	}

	public RobotSpecification findBot(String name, RobotSpecification bots[]) {
		RobotSpecification bot = null;
		int i=0;
		while (i < bots.length && !name.equals(bots[i].getName()))
			++i;
		return bots[i];
	}

	public void onBattleStarted( BattleStartedEvent event ) {}
	public void onBattleError( BattleErrorEvent event ) {}
	public void onBattleFinished( BattleFinishedEvent event ) {}
	public void onBattleMessage( BattleMessageEvent event ) {}
	public void onBattlePaused( BattlePausedEvent event ) {}
	public void onBattleResumed( BattleResumedEvent event ) {}

	public void onRoundEnded( RoundEndedEvent event ) {}
	public void onRoundStarted( RoundStartedEvent event ) {}
	public void onTurnEnded( TurnEndedEvent event ) {}
	public void onTurnStarted( TurnStartedEvent event ) {}
}
