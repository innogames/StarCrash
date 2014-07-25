using UnityEngine;
using System.Collections;
using System;


public class PlayerBehaviour : MonoBehaviour
{

	public float rotationSpeed = 2f;
	public float movementSpeed = 200f;

	private Vector3 stepEffectOffset = new Vector3();
	private float stepProgress = 0f;
	private const float stepSpeed = 0.15f;
	private const float stepAmplitude = 0.05f;

	Vector3 headStartPosition;

	void Awake () {
		Transform head = transform.Find("Head");
		headStartPosition = new Vector3 (head.position.x, head.position.y, head.position.z);
	}
	

	void Update () {

		if (Input.GetKey ("up")) {
			transform.Translate(Vector3.forward * Time.deltaTime * movementSpeed);
			stepProgress += stepSpeed;
			ApplySteppEffect(stepProgress);
		}

		if (Input.GetKey ("down")) {
			transform.Translate(Vector3.back * Time.deltaTime * movementSpeed);
			stepProgress -= stepSpeed;
			ApplySteppEffect(stepProgress);
		}


		if (Input.GetKey ("left")) {
			transform.RotateAround(transform.position, Vector3.up, - rotationSpeed);
		}

		if (Input.GetKey ("right")) {
			transform.RotateAround(transform.position, Vector3.up, rotationSpeed);
		}

	}
	
	
	void ApplySteppEffect(float pProgress) {
		Transform aim = transform.Find("Aim");
		Transform head = transform.Find("Head");

		headStartPosition.x = head.position.x;
		headStartPosition.z = head.position.z;
		head.position = headStartPosition + Vector3.up * - (float)Math.Sin (stepProgress) * stepAmplitude * 10F;

		//aim.position.Set(0, (float) Math.Sin(stepProgress) * stepAmplitude, aim.position.z);
		//head.position = (new Vector3());


	}

}